package com.example.Visitor.Route.Guidance.and.Tracking.System.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.Visitor;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.service.MovementService;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/security")
public class SecurityController {

    @Autowired
    private VisitorRepository visitorRepository;

    @Autowired
    private MovementService movementService;

    @PostMapping("/verify-pass")
    public ResponseEntity<?> verifyPass(@RequestBody Map<String, String> request) {
        String passCode = request.get("passCode");
        if (passCode == null || passCode.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Pass code is required."));
        }

        Visitor visitor = visitorRepository.findByPassCode(passCode)
                .or(() -> visitorRepository.findByQrToken(passCode))
                .orElse(null);

        if (visitor == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "Invalid pass code."));
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String securityOfficer = (auth != null) ? auth.getName() : "Security Guard";

        visitor.setGateVerified(true);
        visitor.setGateVerifiedAt(LocalDateTime.now());
        visitor.setVerifiedBy(securityOfficer);
        visitor.setVisitorStatus("GATE_VERIFIED");
        visitor.setInside(true);
        visitor.setEntryTime(LocalDateTime.now());
        visitorRepository.save(visitor);

        movementService.log(visitor.getQrToken(), "GATE_VERIFIED");

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("visitorStatus", "GATE_VERIFIED");
        response.put("message", "Visitor verified successfully.");

        return ResponseEntity.ok(response);
    }
}

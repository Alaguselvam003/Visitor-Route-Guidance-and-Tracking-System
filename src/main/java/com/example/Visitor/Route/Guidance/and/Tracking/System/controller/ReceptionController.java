package com.example.Visitor.Route.Guidance.and.Tracking.System.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.ApprovalRequest;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.HostApprovalRequest;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.MeetingRequest;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.ReceptionRequest;
import com.example.Visitor.Route.Guidance.and.Tracking.System.service.ReceptionService;

@RestController
@RequestMapping("/api/reception")
public class ReceptionController {

    @Autowired
    private ReceptionService service;

    @PostMapping("/checkin")
    public String checkin(
            @RequestBody ReceptionRequest request) {

        return service.receptionCheckin(
                request.getQrToken(),
                request.getHost());
    }

    @PostMapping("/host-approval")
    public String hostApproval(
            @RequestBody HostApprovalRequest request) {

        return service.hostApproval(
                request.getQrToken(),
                request.getStatus());
    }

    @PostMapping("/approve")
    public String approve(

            @RequestBody ApprovalRequest request

    ) {

        return service.hostApproval(

                request.getQrToken(),

                request.getDecision()

        );
    }

    @PostMapping("/meeting/start")

    public String startMeeting(

            @RequestBody MeetingRequest request

    ) {

        return service.startMeeting(

                request.getQrToken(),

                request.getDurationMinutes()

        );
    }

    @PostMapping("/checkout")

    public String checkout(

            @RequestParam String qrToken

    ) {

        return service.autoCheckout(
                qrToken);

    }

    @GetMapping("/list")
    public java.util.List<com.example.Visitor.Route.Guidance.and.Tracking.System.entity.ReceptionCheckin> listAll() {
        return service.getAllCheckins();
    }
}
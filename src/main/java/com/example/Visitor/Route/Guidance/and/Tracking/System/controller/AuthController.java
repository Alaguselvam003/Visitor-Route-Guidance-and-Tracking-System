package com.example.Visitor.Route.Guidance.and.Tracking.System.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Visitor.Route.Guidance.and.Tracking.System.service.AuthService;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.RegisterRequest;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.LoginRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    

    @PostMapping("/register")
    public String register(
            @RequestBody RegisterRequest request
    ) {
        return authService.register(request);
    }


    @PostMapping("/login")
    public org.springframework.http.ResponseEntity<?> login(
            @RequestBody LoginRequest request
    ) {
        String result = authService.login(request.getEmail(), request.getPassword());
        if ("Invalid Credentials".equals(result) || result.startsWith("Email not verified")) {
            return org.springframework.http.ResponseEntity.status(401).body(result);
        }
        return org.springframework.http.ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(result);
    }


    @PostMapping("/verify")
    public String verifyOtp(
            @RequestParam String email,
            @RequestParam String otp
    ) {

        return authService.verifyOtp(
                email,
                otp
        );
    }
}
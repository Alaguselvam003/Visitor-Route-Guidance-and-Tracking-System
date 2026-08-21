package com.example.visitortracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.visitortracking.service.AuthService;
import com.example.visitortracking.dto.RegisterRequest;
import com.example.visitortracking.dto.LoginRequest;
import com.example.visitortracking.dto.LoginResponse;

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
        try {
            LoginResponse response = authService.login(request.getEmail(), request.getPassword());
            return org.springframework.http.ResponseEntity.ok(response);
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return org.springframework.http.ResponseEntity.status(401).body(e.getMessage());
        }
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

    @PostMapping("/forgot-password")
    public org.springframework.http.ResponseEntity<?> forgotPassword(@RequestParam String email) {
        try {
            String result = authService.forgotPassword(email);
            return org.springframework.http.ResponseEntity.ok(result);
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public org.springframework.http.ResponseEntity<?> resetPassword(
            @RequestParam String email,
            @RequestParam String otp,
            @RequestParam String newPassword
    ) {
        try {
            String result = authService.resetPassword(email, otp, newPassword);
            return org.springframework.http.ResponseEntity.ok(result);
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
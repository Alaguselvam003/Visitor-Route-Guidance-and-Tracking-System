package com.example.Visitor.Route.Guidance.and.Tracking.System.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String otp;

    private Boolean verified=false;

    private LocalDateTime expiryTime;
}
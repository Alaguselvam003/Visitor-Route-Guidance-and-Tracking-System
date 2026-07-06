package com.example.Visitor.Route.Guidance.and.Tracking.System.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.OtpVerification;

import java.util.Optional;

public interface OtpRepository
extends JpaRepository<OtpVerification,Long>{

Optional<OtpVerification> findByEmail(String email);

}
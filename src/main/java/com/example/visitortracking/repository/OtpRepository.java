package com.example.visitortracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.visitortracking.entity.OtpVerification;

import java.util.Optional;

public interface OtpRepository
extends JpaRepository<OtpVerification,Long>{

Optional<OtpVerification> findByEmail(String email);

}
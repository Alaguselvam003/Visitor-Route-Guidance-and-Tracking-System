package com.example.visitortracking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.visitortracking.entity.OtpVerification;

public interface OtpRepository extends JpaRepository<OtpVerification,Long>{

Optional<OtpVerification> findByEmail(String email);

}
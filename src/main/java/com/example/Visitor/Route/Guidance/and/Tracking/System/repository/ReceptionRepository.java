package com.example.Visitor.Route.Guidance.and.Tracking.System.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.ReceptionCheckin;

public interface ReceptionRepository
                extends JpaRepository<ReceptionCheckin, Long> {

        long countByStatus(String status);

        Optional<ReceptionCheckin> findTopByQrTokenOrderByCheckinTimeDesc(String qrToken);

        Optional<ReceptionCheckin> findByQrToken(String qrToken);

        boolean existsByQrToken(String qrToken);

        Optional<ReceptionCheckin> findTopByQrTokenOrderByIdDesc(String qrToken);

        java.util.List<ReceptionCheckin> findByHostNameAndStatus(String hostName, String status);
}
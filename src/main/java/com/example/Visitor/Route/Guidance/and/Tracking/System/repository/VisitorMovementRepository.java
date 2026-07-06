package com.example.Visitor.Route.Guidance.and.Tracking.System.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.VisitorMovement;

public interface VisitorMovementRepository
        extends JpaRepository<VisitorMovement, Long> {

    List<VisitorMovement> findByQrTokenOrderByTimestampAsc(
            String qrToken);

    Optional<VisitorMovement> findTopByQrTokenOrderByIdDesc(
            String qrToken);

}
package com.example.Visitor.Route.Guidance.and.Tracking.System.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.Visitor;

public interface VisitorRepository
                extends JpaRepository<Visitor, Long> {

        boolean existsByEmail(String email);

        boolean existsByPhone(String phone);

        boolean existsByIdNumber(String idNumber);

        Optional<Visitor> findByEmail(String email);

        Optional<Visitor> findByPhone(String phone);

        Optional<Visitor> findByIdNumber(String idNumber);

        Optional<Visitor> findByQrToken(String qrToken);

        long countByInside(boolean inside);

        long countByInsideTrue();

        long countByInsideFalse();

        @Query("""
                        SELECT COUNT(r)
                        FROM ReceptionCheckin r
                        WHERE r.status='WAITING'
                        """)
        long countWaiting();

        @Query("""
                        SELECT COUNT(r)
                        FROM ReceptionCheckin r
                        WHERE r.status='APPROVED'
                        """)
        long countApproved();

}

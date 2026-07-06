package com.example.Visitor.Route.Guidance.and.Tracking.System.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.MovementLog;

public interface MovementRepository
        extends JpaRepository<MovementLog, Integer> {

    List<MovementLog> findByVisitorId(
            Integer visitorId);

}
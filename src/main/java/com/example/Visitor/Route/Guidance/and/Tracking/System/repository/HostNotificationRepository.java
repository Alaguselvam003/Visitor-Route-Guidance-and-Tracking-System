package com.example.Visitor.Route.Guidance.and.Tracking.System.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.HostNotification;
import java.util.Optional;

public interface HostNotificationRepository
        extends JpaRepository<HostNotification, Long> {

    List<HostNotification> findByHost(
            String host);

    Optional<HostNotification> findById(Long id);

}

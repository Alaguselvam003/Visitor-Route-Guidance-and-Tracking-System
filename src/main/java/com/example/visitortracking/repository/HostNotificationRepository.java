package com.example.visitortracking.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.visitortracking.entity.HostNotification;

public interface HostNotificationRepository extends JpaRepository<HostNotification, Long> {

    List<HostNotification> findByHost(String host);

    Optional<HostNotification> findById(Long id);

}

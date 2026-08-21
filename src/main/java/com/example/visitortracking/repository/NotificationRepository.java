package com.example.visitortracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.visitortracking.entity.NotificationLog;

public interface NotificationRepository extends JpaRepository<NotificationLog, Integer>{

}
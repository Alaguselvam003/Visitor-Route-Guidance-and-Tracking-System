package com.example.Visitor.Route.Guidance.and.Tracking.System.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.NotificationLog;

public interface NotificationRepository
extends JpaRepository<
NotificationLog,
Integer>{

}
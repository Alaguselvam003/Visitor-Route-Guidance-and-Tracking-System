package com.example.visitortracking.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.visitortracking.entity.NotificationLog;
import com.example.visitortracking.repository.NotificationRepository;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repo;

    public void notifyHost(
            String email,
            String visitorName) {

        NotificationLog log = new NotificationLog();

        log.setRecipient(email);

        log.setSubject("Visitor Arrived");

        log.setType("EMAIL");

        log.setStatus("SENT");

        log.setSentAt(LocalDateTime.now());

        repo.save(log);

        System.out.println("Host notified : " + visitorName);

    }

}
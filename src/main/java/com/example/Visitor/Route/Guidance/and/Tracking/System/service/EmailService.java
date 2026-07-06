package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.NotificationLog;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.NotificationRepository;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender sender;

    @Autowired
    private NotificationRepository repo;

    public String sendEmail(
            String to,
            String subject,
            String body) {

        try {

            SimpleMailMessage mail =
                    new SimpleMailMessage();

            mail.setTo(to);

            mail.setSubject(subject);

            mail.setText(body);

            sender.send(mail);

            NotificationLog log =
                    new NotificationLog();

            log.setRecipient(to);

            log.setSubject(subject);

            log.setType("EMAIL");

            log.setStatus("SENT");

            log.setSentAt(
                    LocalDateTime.now());

            repo.save(log);

            return "Email Sent";

        } catch (Exception e) {

            NotificationLog log =
                    new NotificationLog();

            log.setRecipient(to);

            log.setSubject(subject);

            log.setType("EMAIL");

            log.setStatus("FAILED");

            log.setSentAt(
                    LocalDateTime.now());

            repo.save(log);

            return "Email Failed : " + e.getMessage();
        }
    }

    public String sendOtp(
            String email,
            String otp) {

        return sendEmail(
                email,
                "OTP Verification",
                "Your OTP is: " + otp);
    }
}
package com.example.visitortracking.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.visitortracking.entity.ReceptionCheckin;
import com.example.visitortracking.entity.Visitor;
import com.example.visitortracking.repository.ReceptionRepository;
import com.example.visitortracking.repository.VisitorRepository;

@Service
public class HostService {

    @Autowired
    private ReceptionRepository repo;

    @Autowired
    private MovementService movementService;

    @Autowired
    private VisitorRepository visitorRepository;

    @Autowired
    private EmailService emailService;

    public String approve(
            String qrToken
    ) {

        Optional<ReceptionCheckin> checkin =
                repo.findTopByQrTokenOrderByIdDesc(qrToken);

        if (checkin.isEmpty()) {

            return "Visitor not checked in";
        }

        ReceptionCheckin r =
                checkin.get();

        r.setStatus("APPROVED");

        repo.save(r);

        Visitor visitor =
                visitorRepository.findByQrToken(qrToken).orElse(null);
        if (visitor != null) {
            visitor.setVisitorStatus("HOST_APPROVED");
            visitorRepository.save(visitor);
            emailService.sendEmail(visitor.getEmail(), "Visit Approved", "Host approved your entry.");
        }

        movementService.log(
                qrToken,
                "HOST_APPROVED"
        );

        return "Host Approved Visitor";
    }

    public String reject(String qrToken) {
        Optional<ReceptionCheckin> checkin = repo.findTopByQrTokenOrderByIdDesc(qrToken);

        if (checkin.isEmpty()) {
            return "Visitor not checked in";
        }

        ReceptionCheckin r = checkin.get();
        r.setStatus("REJECTED");
        repo.save(r);

        Visitor visitor = visitorRepository.findByQrToken(qrToken).orElse(null);
        if (visitor != null) {
            visitor.setVisitorStatus("HOST_REJECTED");
            visitorRepository.save(visitor);
            emailService.sendEmail(visitor.getEmail(), "Visit Rejected", "Host rejected your visit request.");
        }

        movementService.log(qrToken, "HOST_REJECTED");
        return "Host Rejected Visitor";
    }

    public String completeMeeting(String qrToken) {
        ReceptionCheckin reception = repo.findTopByQrTokenOrderByCheckinTimeDesc(qrToken).orElse(null);
        Visitor visitor = visitorRepository.findByQrToken(qrToken).orElse(null);

        if (reception == null && visitor == null) {
            return "Meeting Not Found";
        }

        if (visitor != null) {
            visitor.setInside(false);
            visitor.setExitTime(LocalDateTime.now());
            visitor.setVisitorStatus("MEETING_COMPLETED");
            visitorRepository.save(visitor);
            emailService.sendEmail(visitor.getEmail(), "Visit Completed", "Meeting completed successfully.");
        }

        if (reception != null) {
            reception.setStatus("COMPLETED");
            reception.setMeetingEndTime(LocalDateTime.now());
            repo.save(reception);
        }

        movementService.log(qrToken, "MEETING_COMPLETED");
        return "Meeting Completed Successfully";
    }

    public List<ReceptionCheckin> getHostMeetings(String hostName) {
        String trimmedHost = hostName != null ? hostName.trim() : "";
        return repo.findAll().stream()
            .filter(r -> trimmedHost.equalsIgnoreCase(r.getHostName() != null ? r.getHostName().trim() : ""))
            .collect(Collectors.toList());
    }

}
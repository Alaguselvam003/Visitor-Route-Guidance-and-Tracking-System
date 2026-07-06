package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.ReceptionCheckin;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.ReceptionRepository;

@Service
public class HostService {

    @Autowired
    private ReceptionRepository repo;

    @Autowired
    private MovementService movementService;

    public String approve(
            String qrToken
    ) {

        Optional<ReceptionCheckin> checkin =
                repo.findByQrToken(qrToken);

        if (checkin.isEmpty()) {

            return "Visitor not checked in";
        }

        ReceptionCheckin r =
                checkin.get();

        r.setStatus("APPROVED");

        repo.save(r);

        movementService.log(
                qrToken,
                "HOST_APPROVED"
        );

        return "Host Approved Visitor";
    }

}
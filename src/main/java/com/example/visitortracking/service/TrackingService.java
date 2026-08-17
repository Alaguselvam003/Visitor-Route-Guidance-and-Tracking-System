package com.example.visitortracking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.visitortracking.dto.TrackingResponse;
import com.example.visitortracking.entity.Visitor;
import com.example.visitortracking.entity.VisitorMovement;
import com.example.visitortracking.repository.VisitorMovementRepository;
import com.example.visitortracking.repository.VisitorRepository;

@Service
public class TrackingService {

    @Autowired
    private VisitorRepository visitorRepo;

    @Autowired
    private VisitorMovementRepository movementRepo;

    public TrackingResponse track(
            String qrToken) {

        Visitor v = visitorRepo
                .findByQrToken(qrToken)
                .orElseThrow();

        VisitorMovement m = movementRepo
                .findTopByQrTokenOrderByIdDesc(
                        qrToken)
                .orElse(null);

        TrackingResponse r = new TrackingResponse();

        r.setVisitor(
                v.getName());

        if (m != null) {

            r.setCurrentLocation(
                    m.getLocation());

            r.setLastMovement(
                    m.getLocation());

        }

        if ("MAIN_GATE"
                .equals(
                        r.getCurrentLocation())) {
            r.setProgress("25%");
        } else if ("RECEPTION"
                .equals(
                        r.getCurrentLocation())) {
            r.setProgress("50%");
        } else {
            r.setProgress("100%");
        }

        return r;

    }

}
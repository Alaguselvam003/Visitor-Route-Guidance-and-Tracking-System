package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.TrackingResponse;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.Visitor;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.VisitorMovement;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorMovementRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorRepository;

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
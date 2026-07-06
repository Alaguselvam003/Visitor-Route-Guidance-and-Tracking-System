package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.Visitor;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.VisitorMovement;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorMovementRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorRepository;

@Service
public class MovementService {

        @Autowired
        private VisitorMovementRepository repo;

        @Autowired
        private VisitorRepository visitorRepository;

        public void log(
                        String qrToken,
                        String location) {

                VisitorMovement movement = new VisitorMovement();

                movement.setQrToken(qrToken);

                movement.setLocation(location);

                movement.setTimestamp(
                                LocalDateTime.now());

                Visitor visitor = visitorRepository
                                .findByQrToken(qrToken)
                                .orElse(null);

                if (visitor != null) {

                        movement.setVisitorId(
                                        visitor.getId());

                }

                repo.save(movement);

                System.out.println(
                                "MOVEMENT SAVED");
        }

}
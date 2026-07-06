package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.AnalyticsResponse;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.ReceptionRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorRepository;

@Service
public class AnalyticsService {

    @Autowired
    VisitorRepository visitorRepo;

    @Autowired
    ReceptionRepository receptionRepo;

    public AnalyticsResponse dashboard() {

        AnalyticsResponse r = new AnalyticsResponse();

        r.setTotalVisitors(
                visitorRepo.count());

        r.setInside(
                visitorRepo.countByInside(
                        true));

        r.setExited(
                visitorRepo.countByInside(
                        false));

        r.setApproved(
                receptionRepo
                        .countByStatus(
                                "APPROVED"));

        r.setRejected(
                receptionRepo
                        .countByStatus(
                                "REJECTED"));

        return r;
    }

}
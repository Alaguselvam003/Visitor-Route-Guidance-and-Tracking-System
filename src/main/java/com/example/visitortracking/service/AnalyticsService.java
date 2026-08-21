package com.example.visitortracking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.visitortracking.dto.AnalyticsResponse;
import com.example.visitortracking.repository.ReceptionRepository;
import com.example.visitortracking.repository.VisitorRepository;

@Service
public class AnalyticsService {

    @Autowired
    VisitorRepository visitorRepo;

    @Autowired
    ReceptionRepository receptionRepo;

    public AnalyticsResponse dashboard() {

        AnalyticsResponse r = new AnalyticsResponse();

        r.setTotalVisitors(visitorRepo.count());

        r.setInside(visitorRepo.countByInside(true));

        r.setExited(visitorRepo.countByInside(false));

        r.setApproved(receptionRepo.countByStatus( "APPROVED"));

        r.setRejected( receptionRepo.countByStatus("REJECTED"));

        return r;
    }

}
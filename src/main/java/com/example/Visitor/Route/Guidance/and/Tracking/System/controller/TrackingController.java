package com.example.Visitor.Route.Guidance.and.Tracking.System.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.TrackingResponse;
import com.example.Visitor.Route.Guidance.and.Tracking.System.service.TrackingService;

@RestController
@RequestMapping("/api/tracking")
public class TrackingController {

    @Autowired
    private TrackingService service;

    @GetMapping
    public TrackingResponse track(

            @RequestParam String qrToken

    ) {

        return service.track(
                qrToken);

    }

}
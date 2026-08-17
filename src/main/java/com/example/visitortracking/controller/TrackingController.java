package com.example.visitortracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.visitortracking.dto.TrackingResponse;
import com.example.visitortracking.service.TrackingService;

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
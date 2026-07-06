package com.example.Visitor.Route.Guidance.and.Tracking.System.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.AnalyticsResponse;
import com.example.Visitor.Route.Guidance.and.Tracking.System.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")

public class AnalyticsController {

@Autowired
AnalyticsService service;

@GetMapping

public AnalyticsResponse dashboard() {

return service.dashboard();

}

}
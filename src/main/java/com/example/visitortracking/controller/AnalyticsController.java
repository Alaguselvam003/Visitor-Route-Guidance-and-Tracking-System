package com.example.visitortracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.visitortracking.dto.AnalyticsResponse;
import com.example.visitortracking.service.AnalyticsService;

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
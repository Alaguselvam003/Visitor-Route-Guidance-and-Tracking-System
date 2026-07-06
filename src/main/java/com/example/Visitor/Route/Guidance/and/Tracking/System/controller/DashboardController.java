package com.example.Visitor.Route.Guidance.and.Tracking.System.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.DashboardResponse;
import com.example.Visitor.Route.Guidance.and.Tracking.System.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

@Autowired
private DashboardService service;

@GetMapping
public DashboardResponse dashboard() {

return service.getDashboard();

}

}
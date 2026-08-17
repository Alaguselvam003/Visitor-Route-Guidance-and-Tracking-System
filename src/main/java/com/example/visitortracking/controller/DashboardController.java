package com.example.visitortracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.visitortracking.dto.DashboardResponse;
import com.example.visitortracking.service.DashboardService;

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
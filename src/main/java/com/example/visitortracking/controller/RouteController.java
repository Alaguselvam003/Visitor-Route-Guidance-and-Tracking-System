package com.example.visitortracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.visitortracking.service.RouteService;

@RestController
@RequestMapping("/api/route")
public class RouteController {

    @Autowired
    private RouteService service;

    @GetMapping
    public String route(@RequestParam String destination) {

        return service.getRoute(destination);

    }

}
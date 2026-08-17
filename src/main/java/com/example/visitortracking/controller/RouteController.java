package com.example.visitortracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.visitortracking.service.RouteService;

@RestController
@RequestMapping("/api/route")
public class RouteController {

    @Autowired
    private RouteService service;

    @GetMapping
    public String route(
            @RequestParam String destination
    ) {

        return service.getRoute(
                destination);

    }

}
package com.example.visitortracking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.visitortracking.repository.RouteRepository;

@Service
public class RouteService {

    @Autowired
    private RouteRepository repo;

    public String getRoute(String destination) {

        return repo.findByDestination(destination).map(route -> route.getInstructions()).orElse("Route Not Found");
    }

}
package com.example.visitortracking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.visitortracking.service.HostService;

@RestController
@RequestMapping("/api/host")

public class HostController {

    @Autowired
    private HostService service;

    @PostMapping("/approve")

    public String approve(
            @RequestParam String qrToken
    ) {

        return service.approve(qrToken);

    }

    @Autowired
    private com.example.visitortracking.repository.ReceptionRepository receptionRepository;

    @GetMapping("/waiting")
    public java.util.List<com.example.visitortracking.entity.ReceptionCheckin> getWaiting(@RequestParam String hostName) {
        String trimmedHost = hostName != null ? hostName.trim() : "";
        return receptionRepository.findAll().stream()
            .filter(r -> "WAITING".equalsIgnoreCase(r.getStatus()) && trimmedHost.equalsIgnoreCase(r.getHostName() != null ? r.getHostName().trim() : ""))
            .collect(java.util.stream.Collectors.toList());
    }
}
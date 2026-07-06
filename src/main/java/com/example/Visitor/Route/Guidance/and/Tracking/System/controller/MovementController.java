package com.example.Visitor.Route.Guidance.and.Tracking.System.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.MovementLog;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.MovementRepository;

@RestController
@RequestMapping("/api/movement")
public class MovementController {

@Autowired
private MovementRepository repo;

@GetMapping("/{visitorId}")

public List<MovementLog>
getHistory(

@PathVariable Integer visitorId

){

return repo.findByVisitorId(
visitorId);

}

}
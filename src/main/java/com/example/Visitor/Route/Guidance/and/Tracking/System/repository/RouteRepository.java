package com.example.Visitor.Route.Guidance.and.Tracking.System.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.Route;

public interface RouteRepository
extends JpaRepository<Route,Long>{

Optional<Route> findByDestination(
        String destination
);

}

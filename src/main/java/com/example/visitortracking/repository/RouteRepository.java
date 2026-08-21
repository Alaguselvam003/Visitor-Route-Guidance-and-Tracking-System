package com.example.visitortracking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.visitortracking.entity.Route;

public interface RouteRepository extends JpaRepository<Route,Long>{

Optional<Route> findByDestination(String destination);

}

package com.example.visitortracking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.visitortracking.entity.MovementLog;

public interface MovementRepository extends JpaRepository<MovementLog, Integer> {

    List<MovementLog> findByVisitorId(Integer visitorId);

}
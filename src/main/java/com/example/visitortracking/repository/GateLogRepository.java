package com.example.visitortracking.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.visitortracking.entity.GateLog;

public interface GateLogRepository extends JpaRepository<GateLog,Long>{

}

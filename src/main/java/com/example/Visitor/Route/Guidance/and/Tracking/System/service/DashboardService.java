package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.DashboardResponse;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorRepository;

@Service
public class DashboardService {

@Autowired
private VisitorRepository repo;

public DashboardResponse getDashboard() {

DashboardResponse d =
new DashboardResponse();

d.setTotal(
repo.count());

d.setWaiting(
repo.countWaiting());

d.setApproved(
repo.countApproved());

d.setInside(
repo.countByInsideTrue());

d.setExited(
repo.countByInsideFalse());

return d;

}

}
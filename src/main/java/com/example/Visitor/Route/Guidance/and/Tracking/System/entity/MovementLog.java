package com.example.Visitor.Route.Guidance.and.Tracking.System.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class MovementLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;

    private Long visitorId;

    private String action;

    private String location;

    private LocalDateTime actionTime;

    public Integer getId() {
        return id;
    }

    public Long getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(Long visitorId) {
        this.visitorId = visitorId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getActionTime() {
        return actionTime;
    }

    public void setActionTime(
            LocalDateTime actionTime) {
        this.actionTime = actionTime;
    }

}

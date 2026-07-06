package com.example.Visitor.Route.Guidance.and.Tracking.System.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "visitor_movements")

public class VisitorMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "qr_token")
    private String qrToken;

    private String location;

    private LocalDateTime timestamp;

    private Long visitorId;

    public Long getVisitorId() {
        return visitorId;
    }

    public void setVisitorId(
            Long visitorId) {

        this.visitorId = visitorId;
    }

    public Long getId() {
        return id;
    }

    public void setId(
            Long id) {
        this.id = id;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(
            String qrToken) {
        this.qrToken = qrToken;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(
            String location) {
        this.location = location;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(
            LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

}
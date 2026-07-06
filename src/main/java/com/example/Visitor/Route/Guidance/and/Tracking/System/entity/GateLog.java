package com.example.Visitor.Route.Guidance.and.Tracking.System.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name="gate_logs")

public class GateLog {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String qrToken;

    private String gateName;

    private String status;

    private LocalDateTime timestamp;

    public Long getId() {
        return id;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public String getGateName() {
        return gateName;
    }

    public void setGateName(String gateName) {
        this.gateName = gateName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(
            LocalDateTime timestamp
    ) {
        this.timestamp = timestamp;
    }

}

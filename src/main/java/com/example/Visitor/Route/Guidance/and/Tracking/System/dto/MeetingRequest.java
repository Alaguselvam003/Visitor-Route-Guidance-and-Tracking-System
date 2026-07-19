package com.example.Visitor.Route.Guidance.and.Tracking.System.dto;

public class MeetingRequest {

    private String qrToken;

    private Integer durationMinutes;

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}
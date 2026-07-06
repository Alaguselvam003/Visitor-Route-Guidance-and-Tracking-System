package com.example.Visitor.Route.Guidance.and.Tracking.System.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "reception_checkin")

public class ReceptionCheckin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String qrToken;

    private String hostName;

    private String status;

    private LocalDateTime checkinTime;

    private String nfcTag;

    private LocalDateTime meetingStartTime;

    private LocalDateTime meetingEndTime;

    public Long getId() {
        return id;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public String getHostName() {
        return hostName;
    }

    public void setHostName(String hostName) {
        this.hostName = hostName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCheckinTime() {
        return checkinTime;
    }

    public void setCheckinTime(
            LocalDateTime checkinTime) {
        this.checkinTime = checkinTime;
    }

    public LocalDateTime getMeetingStartTime() {
        return meetingStartTime;
    }

    public void setMeetingStartTime(
            LocalDateTime meetingStartTime) {
        this.meetingStartTime = meetingStartTime;
    }

    public LocalDateTime getMeetingEndTime() {
        return meetingEndTime;
    }

    public void setMeetingEndTime(
            LocalDateTime meetingEndTime) {
        this.meetingEndTime = meetingEndTime;
    }

    public String getNfcTag() {
        return nfcTag;
    }

    public void setNfcTag(String nfcTag) {
        this.nfcTag = nfcTag;
    }
}
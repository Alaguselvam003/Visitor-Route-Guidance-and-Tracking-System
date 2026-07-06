package com.example.Visitor.Route.Guidance.and.Tracking.System.dto;

public class HostApprovalRequest {

    private String qrToken;

    private String status;

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
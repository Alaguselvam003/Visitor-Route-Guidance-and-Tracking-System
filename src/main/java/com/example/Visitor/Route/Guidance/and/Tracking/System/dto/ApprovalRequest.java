package com.example.Visitor.Route.Guidance.and.Tracking.System.dto;

public class ApprovalRequest {

    private String qrToken;

    private String decision;

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }
}
package com.example.Visitor.Route.Guidance.and.Tracking.System.dto;

public class ReceptionRequest {

    private String qrToken;

    private String host;

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }
}
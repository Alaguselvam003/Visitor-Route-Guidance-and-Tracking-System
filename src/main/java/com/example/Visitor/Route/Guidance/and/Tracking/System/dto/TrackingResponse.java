package com.example.Visitor.Route.Guidance.and.Tracking.System.dto;

public class TrackingResponse {

    private String visitor;

    private String currentLocation;

    private String lastMovement;

    private String progress;

    public String getVisitor() {
        return visitor;
    }

    public void setVisitor(String visitor) {
        this.visitor = visitor;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(
            String currentLocation) {
        this.currentLocation = currentLocation;
    }

    public String getLastMovement() {
        return lastMovement;
    }

    public void setLastMovement(
            String lastMovement) {
        this.lastMovement = lastMovement;
    }

    public String getProgress() {
        return progress;
    }

    public void setProgress(
            String progress) {
        this.progress = progress;
    }

}
package com.example.Visitor.Route.Guidance.and.Tracking.System.dto;

public class AnalyticsResponse {

    private long totalVisitors;

    private long inside;

    private long exited;

    private long approved;

    private long rejected;

    public long getTotalVisitors() {
        return totalVisitors;
    }

    public void setTotalVisitors(
            long totalVisitors) {
        this.totalVisitors = totalVisitors;
    }

    public long getInside() {
        return inside;
    }

    public void setInside(
            long inside) {
        this.inside = inside;
    }

    public long getExited() {
        return exited;
    }

    public void setExited(
            long exited) {
        this.exited = exited;
    }

    public long getApproved() {
        return approved;
    }

    public void setApproved(
            long approved) {
        this.approved = approved;
    }

    public long getRejected() {
        return rejected;
    }

    public void setRejected(
            long rejected) {
        this.rejected = rejected;
    }

}
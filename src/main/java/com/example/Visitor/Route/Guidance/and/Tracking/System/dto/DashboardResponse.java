package com.example.Visitor.Route.Guidance.and.Tracking.System.dto;

public class DashboardResponse {

private long total;

private long waiting;

private long approved;

private long inside;

private long exited;

public long getTotal() {
return total;
}

public void setTotal(long total) {
this.total = total;
}

public long getWaiting() {
return waiting;
}

public void setWaiting(long waiting) {
this.waiting = waiting;
}

public long getApproved() {
return approved;
}

public void setApproved(long approved) {
this.approved = approved;
}

public long getInside() {
return inside;
}

public void setInside(long inside) {
this.inside = inside;
}

public long getExited() {
return exited;
}

public void setExited(long exited) {
this.exited = exited;
}

}

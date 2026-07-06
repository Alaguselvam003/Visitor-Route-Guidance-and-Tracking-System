package com.example.Visitor.Route.Guidance.and.Tracking.System.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class NotificationLog {

@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)

private Integer id;

private String recipient;

private String subject;

private String type;

private String status;

private LocalDateTime sentAt;

public Integer getId() {
return id;
}

public void setRecipient(String recipient) {
this.recipient = recipient;
}

public String getRecipient() {
return recipient;
}

public void setSubject(String subject) {
this.subject = subject;
}

public String getSubject() {
return subject;
}

public void setType(String type) {
this.type = type;
}

public String getType() {
return type;
}

public void setStatus(String status) {
this.status = status;
}

public String getStatus() {
return status;
}

public void setSentAt(LocalDateTime sentAt) {
this.sentAt = sentAt;
}

public LocalDateTime getSentAt() {
return sentAt;
}

}
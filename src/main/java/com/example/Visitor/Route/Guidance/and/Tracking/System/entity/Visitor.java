package com.example.Visitor.Route.Guidance.and.Tracking.System.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "visitors")
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    @Column(unique = true)
    private String phone;

    @Column(unique = true)
    private String idNumber;

    private String password;

    private boolean blacklisted = false;

    private boolean duplicateDetected = false;

    private boolean verified = false;

    private String otp;

    private LocalDateTime otpExpiry;

    private String qrToken;

    private LocalDateTime qrExpiry;

    private LocalDateTime entryTime;

    private LocalDateTime exitTime;

    private boolean inside = false;

    private String nfcTag;

    private String currentZone;

    private LocalDateTime zoneEntryTime;

    private String securityAlert;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isBlacklisted() {
        return blacklisted;
    }

    public void setBlacklisted(boolean blacklisted) {
        this.blacklisted = blacklisted;
    }

    public boolean isDuplicateDetected() {
        return duplicateDetected;
    }

    public void setDuplicateDetected(boolean duplicateDetected) {
        this.duplicateDetected = duplicateDetected;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }

    public LocalDateTime getQrExpiry() {
        return qrExpiry;
    }

    public void setQrExpiry(LocalDateTime qrExpiry) {
        this.qrExpiry = qrExpiry;
    }

    public LocalDateTime getEntryTime() {
        return entryTime;
    }

    public void setEntryTime(LocalDateTime entryTime) {
        this.entryTime = entryTime;
    }

    public LocalDateTime getExitTime() {
        return exitTime;
    }

    public void setExitTime(LocalDateTime exitTime) {
        this.exitTime = exitTime;
    }

    public boolean isInside() {
        return inside;
    }

    public void setInside(boolean inside) {
        this.inside = inside;
    }

    public String getNfcTag() {
        return nfcTag;
    }

    public void setNfcTag(String nfcTag) {
        this.nfcTag = nfcTag;
    }

    public String getCurrentZone() {
        return currentZone;
    }

    public void setCurrentZone(String currentZone) {
        this.currentZone = currentZone;
    }

    public LocalDateTime getZoneEntryTime() {
        return zoneEntryTime;
    }

    public void setZoneEntryTime(LocalDateTime zoneEntryTime) {
        this.zoneEntryTime = zoneEntryTime;
    }

    public String getSecurityAlert() {
        return securityAlert;
    }

    public void setSecurityAlert(String securityAlert) {
        this.securityAlert = securityAlert;
    }
}
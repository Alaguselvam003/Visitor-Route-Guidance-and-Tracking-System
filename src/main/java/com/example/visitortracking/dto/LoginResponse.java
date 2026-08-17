package com.example.visitortracking.dto;

public class LoginResponse {
    private String token;
    private String role;
    private String email;
    private String name;
    private String qrToken;

    public LoginResponse() {}

    public LoginResponse(String token, String role, String email, String name, String qrToken) {
        this.token = token;
        this.role = role;
        this.email = email;
        this.name = name;
        this.qrToken = qrToken;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(String qrToken) {
        this.qrToken = qrToken;
    }
}

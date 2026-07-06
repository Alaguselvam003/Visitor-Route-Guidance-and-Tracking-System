package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class OtpService {

    private Map<String, String> otpStore =
            new HashMap<>();

    public String generateOtp() {

        return String.valueOf(
                (int)(100000 +
                Math.random() * 900000));

    }

    public void saveOtp(
            String email,
            String otp) {

        otpStore.put(
                email,
                otp);

    }

    public boolean verify(
            String email,
            String otp) {

        return otp.equals(
                otpStore.get(email));

    }

}
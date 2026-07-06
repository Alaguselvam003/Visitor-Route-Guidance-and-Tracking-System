package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.User;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.UserRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.security.JwtUtil;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.RegisterRequest;

import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.Visitor;
import org.springframework.security.crypto.password.PasswordEncoder;
import jakarta.annotation.PostConstruct;

@Service
public class AuthService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VisitorRepository visitorRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void seedUsers() {
        if (userRepository.count() == 0) {
            // Seed Admin
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@company.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setVerified(true);
            userRepository.save(admin);

            // Seed Receptionist
            User reception = new User();
            reception.setName("Receptionist");
            reception.setEmail("reception@company.com");
            reception.setPassword(passwordEncoder.encode("reception123"));
            reception.setRole("RECEPTIONIST");
            reception.setVerified(true);
            userRepository.save(reception);

            // Seed Security
            User security = new User();
            security.setName("Security Guard");
            security.setEmail("security@company.com");
            security.setPassword(passwordEncoder.encode("security123"));
            security.setRole("SECURITY");
            security.setVerified(true);
            userRepository.save(security);

            // Seed Host
            User host = new User();
            host.setName("Meeting Host");
            host.setEmail("host@company.com");
            host.setPassword(passwordEncoder.encode("host123"));
            host.setRole("HOST");
            host.setVerified(true);
            userRepository.save(host);
        }
    }

    public String register(RegisterRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()){
            return "Email already registered";
        }

        User user=new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("HOST"); // Default role for manual registrations

        String otp= String.valueOf((int)((Math.random()*900000)+100000));
        user.setOtp(otp);
        user.setVerified(false);

        userRepository.save(user);

        emailService.sendOtp(user.getEmail(), otp);
        return "OTP sent successfully";
    }

    public String sendOtp(String email) {
        String otp = String.valueOf((int) ((Math.random() * 900000) + 100000));
        User user = userRepository.findByEmail(email).orElseThrow(
            () -> new RuntimeException("User not found")
        );

        user.setOtp(otp);
        user.setVerified(false);
        userRepository.save(user);

        emailService.sendOtp(email, otp);
        return "OTP sent successfully";
    }

    public String verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email).orElseThrow(
            () -> new RuntimeException("User not found")
        );

        if (user.getOtp() != null && user.getOtp().equals(otp)) {
            user.setVerified(true);
            user.setOtp(null);
            userRepository.save(user);
            return "OTP verified successfully";
        }
        return "Invalid OTP";
    }

    public String login(String email, String password) {
        // 1. Search in Staff/Users table
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtil.generateToken(email, user.getRole());
                return "{\"token\":\"" + token + "\", \"role\":\"" + user.getRole() + "\", \"email\":\"" + email + "\", \"name\":\"" + user.getName() + "\"}";
            }
            return "Invalid Credentials";
        }

        // 2. Search in Visitors table
        Visitor visitor = visitorRepository.findByEmail(email).orElse(null);
        if (visitor != null) {
            if (!visitor.isVerified()) {
                return "Email not verified. Please complete OTP registration.";
            }
            if (passwordEncoder.matches(password, visitor.getPassword())) {
                String token = jwtUtil.generateToken(email, "VISITOR");
                return "{\"token\":\"" + token + "\", \"role\":\"VISITOR\", \"email\":\"" + email + "\", \"name\":\"" + visitor.getName() + "\", \"qrToken\":\"" + visitor.getQrToken() + "\"}";
            }
            return "Invalid Credentials";
        }

        return "Invalid Credentials";
    }
}
package com.example.visitortracking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

import com.example.visitortracking.entity.User;
import com.example.visitortracking.repository.UserRepository;
import com.example.visitortracking.security.JwtUtil;
import com.example.visitortracking.dto.RegisterRequest;

import com.example.visitortracking.repository.VisitorRepository;
import com.example.visitortracking.entity.Visitor;
import com.example.visitortracking.dto.LoginResponse;
import org.springframework.security.authentication.BadCredentialsException;
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
        if (userRepository.findByEmail("admin@company.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@company.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("ADMIN");
            admin.setVerified(true);
            userRepository.save(admin);
        }

        if (userRepository.findByEmail("reception@company.com").isEmpty()) {
            User reception = new User();
            reception.setName("Receptionist");
            reception.setEmail("reception@company.com");
            reception.setPassword(passwordEncoder.encode("reception123"));
            reception.setRole("RECEPTIONIST");
            reception.setVerified(true);
            userRepository.save(reception);
        }

        if (userRepository.findByEmail("security@company.com").isEmpty()) {
            User security = new User();
            security.setName("Security Guard");
            security.setEmail("security@company.com");
            security.setPassword(passwordEncoder.encode("security123"));
            security.setRole("SECURITY");
            security.setVerified(true);
            userRepository.save(security);
        }

        if (userRepository.findByEmail("host@company.com").isEmpty()) {
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

        if (request.getPassword() == null || request.getPassword().length() < 6 || !request.getPassword().matches(".*[^a-zA-Z0-9].*")) {
            return "Registration Failed: Password must be at least 6 characters long and contain at least one special character";
        }

        User user=new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("HOST");

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

    public LoginResponse login(String email, String password) {

        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            if (passwordEncoder.matches(password, user.getPassword())) {
                String token = jwtUtil.generateToken(email, user.getRole());
                return new LoginResponse(token, user.getRole(), email, user.getName(), null);
            }
            throw new BadCredentialsException("Invalid Credentials");
        }

        Visitor visitor = visitorRepository.findByEmail(email).orElse(null);
        if (visitor != null) {
            if (!visitor.isVerified()) {
                throw new BadCredentialsException("Email not verified. Please complete OTP registration.");
            }
            if (passwordEncoder.matches(password, visitor.getPassword())) {
                String token = jwtUtil.generateToken(email, "VISITOR");
                return new LoginResponse(token, "VISITOR", email, visitor.getName(), visitor.getQrToken());
            }
            throw new BadCredentialsException("Invalid Credentials");
        }

        throw new BadCredentialsException("Invalid Credentials");
    }

    public String forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String otp = String.valueOf((int) ((Math.random() * 900000) + 100000));
            user.setOtp(otp);
            userRepository.save(user);
            emailService.sendOtp(email, otp);
            return "OTP sent successfully";
        }

        Optional<Visitor> visitorOpt = visitorRepository.findByEmail(email);
        if (visitorOpt.isPresent()) {
            Visitor visitor = visitorOpt.get();
            String otp = String.valueOf((int) ((Math.random() * 900000) + 100000));
            visitor.setOtp(otp);
            visitor.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
            visitorRepository.save(visitor);
            emailService.sendOtp(email, otp);
            return "OTP sent successfully";
        }

        throw new RuntimeException("Email not registered");
    }

    public String resetPassword(String email, String otp, String newPassword) {
        if (newPassword == null || newPassword.length() < 6 || !newPassword.matches(".*[^a-zA-Z0-9].*")) {
            throw new RuntimeException("Password must be at least 6 characters long and contain at least one special character");
        }
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getOtp() != null && user.getOtp().equals(otp)) {
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setOtp(null);
                userRepository.save(user);
                return "Password reset successfully";
            }
            throw new RuntimeException("Invalid OTP");
        }

        Optional<Visitor> visitorOpt = visitorRepository.findByEmail(email);
        if (visitorOpt.isPresent()) {
            Visitor visitor = visitorOpt.get();
            if (visitor.getOtp() != null && visitor.getOtp().equals(otp)) {
                if (visitor.getOtpExpiry() != null && visitor.getOtpExpiry().isBefore(LocalDateTime.now())) {
                    throw new RuntimeException("OTP has expired");
                }
                visitor.setPassword(passwordEncoder.encode(newPassword));
                visitor.setOtp(null);
                visitor.setOtpExpiry(null);
                visitorRepository.save(visitor);
                return "Password reset successfully";
            }
            throw new RuntimeException("Invalid OTP");
        }

        throw new RuntimeException("Email not registered");
    }
}
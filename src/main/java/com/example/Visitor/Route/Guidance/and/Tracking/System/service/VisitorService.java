package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.DashboardResponse;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.VisitorRequest;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.HostNotification;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.ReceptionCheckin;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.Visitor;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.HostNotificationRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.ReceptionRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorRepository;

@Service
public class VisitorService {

        @Autowired
        private VisitorRepository repo;

        @Autowired
        private ReceptionRepository receptionRepo;

        @Autowired
        private HostNotificationRepository notifyRepo;

        @Autowired
        private EmailService emailService;

        @Autowired
        private PasswordEncoder passwordEncoder;

        @Autowired
        private MovementService movementService;

        private final VisitorRepository visitorRepository;

        public VisitorService(VisitorRepository visitorRepository) {
                this.visitorRepository = visitorRepository;
        }

        public String register(VisitorRequest request) {
                try {

                        if ("blacklisted@test.com".equalsIgnoreCase(request.getEmail()) ||
                            "9999999999".equals(request.getPhone())) {
                                return "Registration Failed: Visitor is blacklisted.";
                        }

                        Optional<Visitor> existingByEmail = visitorRepository.findByEmail(request.getEmail());
                        if (existingByEmail.isPresent()) {
                                Visitor old = existingByEmail.get();
                                if (old.isBlacklisted()) {
                                        return "Registration Failed: Visitor is blacklisted.";
                                }
                                if (!old.isVerified()) {
                                        old.setName(request.getName());
                                        old.setPhone(request.getPhone());
                                        old.setIdNumber(request.getIdNumber());
                                        old.setPassword(passwordEncoder.encode(request.getPassword()));
                                        old.setOtp(generateOtp());
                                        old.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
                                        visitorRepository.save(old);
                                        emailService.sendOtp(old.getEmail(), old.getOtp());
                                        return "OTP Sent Again";
                                }
                                return "Account already verified. Please login";
                        }

                        Optional<Visitor> existingByPhone = visitorRepository.findByPhone(request.getPhone());
                        if (existingByPhone.isPresent() && existingByPhone.get().isBlacklisted()) {
                                return "Registration Failed: Visitor is blacklisted.";
                        }
                        Optional<Visitor> existingById = visitorRepository.findByIdNumber(request.getIdNumber());
                        if (existingById.isPresent() && existingById.get().isBlacklisted()) {
                                return "Registration Failed: Visitor is blacklisted.";
                        }

                        Visitor visitor = new Visitor();

                        if (visitorRepository.existsByPhone(request.getPhone()) ||
                            visitorRepository.existsByIdNumber(request.getIdNumber())) {
                                visitor.setDuplicateDetected(true);
                        }

                        visitor.setName(request.getName());
                        visitor.setEmail(request.getEmail());
                        visitor.setPhone(request.getPhone());
                        visitor.setIdNumber(request.getIdNumber());
                        visitor.setPassword(passwordEncoder.encode(request.getPassword()));
                        visitor.setVerified(false);
                        visitor.setOtp(generateOtp());
                        visitor.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

                        visitorRepository.save(visitor);
                        emailService.sendOtp(visitor.getEmail(), visitor.getOtp());

                        return "Visitor Registered Successfully";
                } catch (org.springframework.dao.DataIntegrityViolationException e) {
                        return "Registration Failed: Phone number or ID number is already registered by another visitor.";
                } catch (Exception e) {
                        return "Registration Failed: " + e.getMessage();
                }
        }

        private String generateOtp() {

                Random random = new Random();

                return String.valueOf(100000 + random.nextInt(900000));
        }

        public String verifyOtp(String email, String otp) {

                Visitor visitor = visitorRepository
                                .findByEmail(email)
                                .orElseThrow();

                if (!visitor.getOtp().equals(otp)) {
                        return "Invalid OTP";
                }

                visitor.setVerified(true);
                visitor.setQrToken("V-" + (1000 + new java.util.Random().nextInt(9000)));

                visitor.setQrExpiry(LocalDateTime.now().plusHours(4));

                visitorRepository.save(visitor);

                return "OTP Verified Successfully";
        }

        public String validateQr(
                        String token) {

                Visitor visitor = repo.findByQrToken(token)
                                .orElse(null);

                if (visitor == null) {
                        return "Invalid QR";
                }

                if (visitor.getQrExpiry() == null ||
                    visitor.getQrExpiry().isBefore(LocalDateTime.now())) {

                        return "QR Expired";
                }

                visitor.setVerified(true);

                repo.save(visitor);

                return "Access Granted";
        }

        public String scanQr(String qrToken) {

                Visitor visitor = visitorRepository
                                .findByQrToken(qrToken)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Invalid QR"));

                if (!visitor.isVerified()) {
                        return "Visitor not verified";
                }

                if (visitor.getQrExpiry() != null &&
                                visitor.getQrExpiry()
                                                .isBefore(LocalDateTime.now())) {

                        return "QR Expired";
                }

                visitor.setInside(true);

                visitor.setEntryTime(
                                LocalDateTime.now());

                visitorRepository.save(visitor);

                return "Gate Entry Success";
        }

        public String checkIn(
                        String token) {

                Visitor visitor = repo.findByQrToken(token)
                                .orElse(null);

                if (visitor == null) {
                        return "Invalid QR";
                }

                visitor.setInside(true);

                visitor.setEntryTime(
                                LocalDateTime.now());

                repo.save(visitor);

                return "Visitor Entered";
        }

        public Visitor getVisitorByQr(String token) {

                return visitorRepository
                                .findByQrToken(token)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Invalid QR Token"));
        }

        public String checkOut(
                        String token) {

                Visitor visitor = repo.findByQrToken(token)
                                .orElse(null);

                if (visitor == null) {
                        return "Invalid QR";
                }

                visitor.setInside(false);

                visitor.setExitTime(
                                LocalDateTime.now());

                repo.save(visitor);

                emailService.sendEmail(
                                visitor.getEmail(),
                                "Exit Confirmation",
                                "Visitor Exit Completed");

                return "Visitor Exited";
        }

        public String getJourney(
                        String token) {

                return "Journey Tracking Coming Soon";
        }

        public String gateEntry(
                        String token,
                        String gate) {

                Visitor visitor = repo.findByQrToken(token)
                                .orElse(null);

                if (visitor == null) {
                        return "Invalid Visitor";
                }

                visitor.setInside(true);

                visitor.setEntryTime(
                                LocalDateTime.now());

                repo.save(visitor);

                movementService.log(
                                token,
                                gate);

                return "Gate Access Granted";
        }

        public String receptionCheckin(
                        String token,
                        String host) {

                Visitor visitor = repo.findByQrToken(token)
                                .orElse(null);

                if (visitor == null) {
                        return "Invalid Visitor";
                }

                ReceptionCheckin r = new ReceptionCheckin();

                r.setQrToken(token);

                r.setHostName(host);

                r.setStatus("WAITING");

                r.setCheckinTime(
                                LocalDateTime.now());

                receptionRepo.save(r);

                movementService.log(
                                token,
                                "RECEPTION");

                return "Reception Check-in Completed";
        }

        public String approveVisitor(
                        String token) {

                ReceptionCheckin reception = receptionRepo
                                .findTopByQrTokenOrderByCheckinTimeDesc(token)
                                .orElse(null);

                if (reception == null) {
                        return "Visitor Not Found";
                }

                reception.setStatus(
                                "APPROVED");

                receptionRepo.save(
                                reception);

                return "Visitor Approved";
        }

        public String completeMeeting(
                        String token) {

                ReceptionCheckin reception = receptionRepo
                                .findTopByQrTokenOrderByCheckinTimeDesc(token)
                                .orElse(null);

                if (reception == null) {
                        return "Meeting Not Found";
                }

                Visitor visitor = repo.findByQrToken(token)
                                .orElse(null);

                if (visitor != null) {

                        visitor.setInside(false);

                        visitor.setExitTime(
                                        LocalDateTime.now());

                        repo.save(visitor);

                        emailService.sendEmail(
                                        visitor.getEmail(),
                                        "Visit Completed",
                                        "Meeting completed successfully");
                }

                reception.setStatus(
                                "COMPLETED");

                reception.setMeetingEndTime(
                                LocalDateTime.now());

                receptionRepo.save(
                                reception);

                return "Meeting Completed + Visitor Exited";
        }

        public Object notifications(
                        String host) {

                return notifyRepo.findByHost(host);
        }

        public String readNotification(
                        Long id) {

                HostNotification notification = notifyRepo.findById(id)
                                .orElse(null);

                if (notification == null) {
                        return "Notification Not Found";
                }

                notification.setReadStatus(true);

                notifyRepo.save(notification);

                return "Notification Read";
        }

        public DashboardResponse dashboard() {

                DashboardResponse d = new DashboardResponse();

                d.setTotal(repo.count());

                d.setWaiting(
                                receptionRepo.countByStatus("WAITING"));

                d.setApproved(
                                receptionRepo.countByStatus("APPROVED"));

                d.setInside(
                                repo.countByInside(true));

                d.setExited(
                                repo.count()
                                                - repo.countByInside(true));

                return d;
        }

        public java.util.List<Visitor> getAllVisitors() {
                return visitorRepository.findAll();
        }

        public Object report() {

                Map<String, Object> map = new HashMap<>();

                map.put(
                                "registered",
                                repo.count());

                map.put(
                                "inside",
                                repo.countByInside(true));

                map.put(
                                "approved",
                                receptionRepo.countByStatus("APPROVED"));

                map.put(
                                "completed",
                                receptionRepo.countByStatus("COMPLETED"));

                return map;
        }

        public Object history() {

                return Map.of(
                                "registered",
                                repo.count(),
                                "waiting",
                                receptionRepo.countByStatus("WAITING"),
                                "approved",
                                receptionRepo.countByStatus("APPROVED"),
                                "completed",
                                receptionRepo.countByStatus("COMPLETED"),
                                "inside",
                                repo.countByInside(true));
        }

        public String gateExit(String qrToken) {

                Visitor visitor = visitorRepository
                                .findByQrToken(qrToken)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Invalid QR"));

                if (!visitor.isInside()) {
                        return "Visitor already exited";
                }

                visitor.setInside(false);

                visitor.setExitTime(
                                LocalDateTime.now());

                visitorRepository.save(visitor);
                movementService.log(qrToken,
                                "EXIT_GATE");

                return "Exit Completed Successfully";
        }

        public String assignNfc(String qrToken, String nfcTag) {
                Visitor visitor = visitorRepository.findByQrToken(qrToken)
                                .orElseThrow(() -> new RuntimeException("Visitor not found"));
                visitor.setNfcTag(nfcTag);
                visitorRepository.save(visitor);

                receptionRepo.findByQrToken(qrToken).ifPresent(checkin -> {
                        checkin.setNfcTag(nfcTag);
                        receptionRepo.save(checkin);
                });

                return "NFC Tag Assigned Successfully";
        }

        public String simulateZone(String qrToken, String zone, String alert) {
                Visitor visitor = visitorRepository.findByQrToken(qrToken)
                                .orElseThrow(() -> new RuntimeException("Visitor not found"));
                visitor.setCurrentZone(zone);
                visitor.setZoneEntryTime(LocalDateTime.now());
                if (alert != null && !alert.isEmpty()) {
                        visitor.setSecurityAlert(alert);
                } else if ("RESTRICTED".equalsIgnoreCase(zone)) {
                        visitor.setSecurityAlert("Unauthorised entry into Restricted Area!");
                } else {
                        visitor.setSecurityAlert(null);
                }
                visitorRepository.save(visitor);
                return "Zone Updated Successfully";
        }
}

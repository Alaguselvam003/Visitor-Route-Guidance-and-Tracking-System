package com.example.Visitor.Route.Guidance.and.Tracking.System.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.HostNotification;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.ReceptionCheckin;
import com.example.Visitor.Route.Guidance.and.Tracking.System.entity.Visitor;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.HostNotificationRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.ReceptionRepository;
import com.example.Visitor.Route.Guidance.and.Tracking.System.repository.VisitorRepository;

@Service
public class ReceptionService {

        @Autowired
        private VisitorRepository visitorRepository;

        @Autowired
        private ReceptionRepository receptionRepo;

        @Autowired
        private HostNotificationRepository notifyRepo;

        @Autowired
        private EmailService emailService;

        @Autowired
        private MovementService movementService;

        public String receptionCheckin(
                        String qrToken,
                        String host) {

                Visitor visitor = visitorRepository
                                .findByQrToken(qrToken)
                                .orElse(null);

                if (visitor == null) {
                        return "Invalid QR";
                }

                if (receptionRepo.existsByQrToken(qrToken)) {
                        return "Visitor already checked-in";
                }

                ReceptionCheckin r = new ReceptionCheckin();

                r.setQrToken(qrToken);

                r.setHostName(host);

                r.setStatus("WAITING");

                r.setCheckinTime(
                                LocalDateTime.now());

                receptionRepo.save(r);

                HostNotification n = new HostNotification();

                n.setHost(host);

                n.setMessage(
                                "Visitor " +
                                                visitor.getName() +
                                                " waiting");

                n.setCreatedAt(
                                LocalDateTime.now());

                notifyRepo.save(n);

                emailService.sendEmail(
                                visitor.getEmail(),
                                "Reception Check-in",
                                "Waiting for host approval");

                movementService.log(
                                qrToken,
                                "RECEPTION");

                return "Reception Check-in Completed";
        }

        public String hostApproval(
                        String qrToken,
                        String decision) {

                ReceptionCheckin checkin = receptionRepo
                                .findByQrToken(qrToken)
                                .orElse(null);

                if (checkin == null) {
                        return "Reception record not found";
                }

                Visitor visitor = visitorRepository
                                .findByQrToken(qrToken)
                                .orElse(null);

                if (visitor == null) {
                        return "Visitor not found";
                }

                if (decision.equalsIgnoreCase("APPROVE")) {

                        checkin.setStatus("APPROVED");

                        movementService.log(
                                        qrToken,
                                        "HOST_APPROVED");

                        emailService.sendEmail(
                                        visitor.getEmail(),
                                        "Visit Approved",
                                        "Host approved your entry.");

                } else if (decision.equalsIgnoreCase("REJECT")) {

                        checkin.setStatus("REJECTED");

                        movementService.log(
                                        qrToken,
                                        "HOST_REJECTED");

                        emailService.sendEmail(
                                        visitor.getEmail(),
                                        "Visit Rejected",
                                        "Host rejected your request.");

                } else {

                        return "Invalid decision";
                }

                receptionRepo.save(checkin);

                return "Visitor " + decision;
        }

        public String startMeeting(

                        String qrToken,

                        Integer durationMinutes

        ) {

                ReceptionCheckin checkin =

                                receptionRepo
                                                .findByQrToken(qrToken)
                                                .orElse(null);

                if (checkin == null) {

                        return "Reception record not found";
                }

                if (!checkin
                                .getStatus()
                                .equals("APPROVED")) {

                        return "Meeting allowed only after approval";
                }

                LocalDateTime now = LocalDateTime.now();

                checkin.setStatus(
                                "IN_MEETING");

                checkin.setMeetingStartTime(
                                now);

                checkin.setMeetingEndTime(
                                now.plusMinutes(
                                                durationMinutes));

                receptionRepo.save(
                                checkin);

                movementService.log(

                                qrToken,

                                "MEETING_ROOM"

                );

                return "Meeting Started";
        }

        public String autoCheckout(

                        String qrToken

        ) {

                ReceptionCheckin checkin =

                                receptionRepo
                                                .findByQrToken(qrToken)
                                                .orElse(null);

                Visitor visitor =

                                visitorRepository
                                                .findByQrToken(qrToken)
                                                .orElse(null);

                if (checkin == null ||
                                visitor == null) {

                        return "Invalid";
                }

                if (checkin
                                .getMeetingEndTime() == null) {

                        return "Meeting not started";
                }

                if (LocalDateTime.now()
                                .isBefore(

                                                checkin
                                                                .getMeetingEndTime()

                                )) {

                        return "Meeting still active";
                }

                visitor.setInside(
                                false);

                visitor.setExitTime(
                                LocalDateTime.now());

                visitorRepository.save(
                                visitor);

                checkin.setStatus(
                                "COMPLETED");

                receptionRepo.save(
                                checkin);

                movementService.log(

                                qrToken,

                                "AUTO_CHECKOUT"

                );

                return "Visitor Auto Checked Out";
        }

        public java.util.List<ReceptionCheckin> getAllCheckins() {
                return receptionRepo.findAll();
        }
}
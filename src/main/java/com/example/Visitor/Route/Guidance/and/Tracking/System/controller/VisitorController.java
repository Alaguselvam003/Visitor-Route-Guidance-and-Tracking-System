package com.example.Visitor.Route.Guidance.and.Tracking.System.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.DashboardResponse;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.VisitorRequest;
import com.example.Visitor.Route.Guidance.and.Tracking.System.service.VisitorService;
import com.example.Visitor.Route.Guidance.and.Tracking.System.dto.ReceptionRequest;

@RestController
@RequestMapping("/api/visitor")

public class VisitorController {

    @Autowired
    private VisitorService service;

    @PostMapping("/register")
    public ResponseEntity<?> register( @RequestBody VisitorRequest request) {

        return ResponseEntity.ok(
                service.register(request));
    }

    @PostMapping("/verify-otp")
    public String verifyOtp( @RequestParam String email, @RequestParam String otp) {
        return service.verifyOtp(email,otp);
    }

    @GetMapping("/qr/{token}")
    public ResponseEntity<?> getVisitorByQr(@PathVariable String token){
        return ResponseEntity.ok(service.getVisitorByQr(token));
    }

    @GetMapping("/gate-scan/{qrToken}")
    public String gateScan(@PathVariable String qrToken){

        return service.scanQr(qrToken);

    }

    @PostMapping("/scan")
    public String scanQr(@RequestParam String token){

        return service.validateQr(token);
    }

    @PostMapping("/checkin")
    public String receptionCheckin(@RequestBody ReceptionRequest request) {

        return service.receptionCheckin(request.getQrToken(),request.getHost());

    }

    @PostMapping("/checkout")
    public String checkOut(@RequestParam String token) {

        return service.checkOut(token);
    }

    @GetMapping("/journey")
    public String journey(@RequestParam String token) {

        return service.getJourney(token);
    }

    @PostMapping("/gate")
    public String gate(@RequestParam String token,@RequestParam String gate) {

        return service.gateEntry(token, gate);
    }

    @PostMapping("/gate-entry")
    public String gateEntry( @RequestParam String token, @RequestParam String gate) {

        return service.gateEntry(token, gate);

    }

    @PostMapping("/reception")
    public String reception( @RequestParam String token, @RequestParam String host) {

        return service.receptionCheckin(token, host);
    }

    @PostMapping("/approve")
    public String approve(
            @RequestParam String token) {

        return service.approveVisitor(token);
    }

    @GetMapping("/dashboard")
    public DashboardResponse dashboard() {

        return service.dashboard();
    }

    @GetMapping("/list")
    public java.util.List<com.example.Visitor.Route.Guidance.and.Tracking.System.entity.Visitor> listAll() {
        return service.getAllVisitors();
    }

    @GetMapping("/notifications")
    public Object notifications(
            @RequestParam String host) {

        return service.notifications(host);
    }

    @PostMapping("/notification/read")
    public String read(
            @RequestParam Long id) {

        return service.readNotification(id);
    }

    @PostMapping("/meeting/complete")
    public String complete(
            @RequestParam String token) {

        return service.completeMeeting(token);
    }

    @GetMapping("/report")
    public Object report() {

        return service.report();
    }

    @GetMapping("/history")
    public Object history() {

        return service.history();
    }

    @PostMapping("/exit/{qrToken}")

    public String exit(@PathVariable String qrToken) {

        return service.gateExit(qrToken);

    }

    @PostMapping("/assign-nfc")
    public String assignNfc(@RequestParam String qrToken,@RequestParam String nfcTag) {
        return service.assignNfc(qrToken, nfcTag);
    }

    @PostMapping("/simulate-zone")
    public String simulateZone(@RequestParam String qrToken, @RequestParam String zone, @RequestParam(required = false) String alert) {
        return service.simulateZone(qrToken, zone, alert);
    }
}
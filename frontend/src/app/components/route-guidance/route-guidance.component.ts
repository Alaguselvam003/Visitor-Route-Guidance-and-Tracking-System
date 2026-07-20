import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import * as QRCode from 'qrcode';

interface NavStep {
  name: string;
  title: string;
  instructions: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-route-guidance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './route-guidance.component.html',
  styleUrls: ['./route-guidance.component.css']
})
export class RouteGuidanceComponent implements OnInit, OnDestroy {
  visitorName = 'Guest Visitor';
  visitorEmail = 'visitor@company.com';
  ticketCode = '';
  visitorId: number | null = null;
  visitorStatus = 'REGISTERED';
  gateVerified = false;

  currentStep = 0;
  isSimulating = false;
  isMuted = false;
  isDeviated = false;
  beaconLog: string[] = [];

  dotX = 110;
  dotY = 160;

  hostName = 'Meeting Host';
  isCheckingIn = false;
  showSuccessAlert = false;
  isInitialLoad = true;

  private pollingInterval: any;
  private simulationInterval: any;

  steps: NavStep[] = [
    {
      name: 'Security Gate',
      title: 'Entrance Security Check',
      instructions: 'Please approach the scanner at the Main Security Gate. Scan the QR code displayed on your digital pass to verify entry and proceed to the lobby.',
      x: 110,
      y: 160
    },
    {
      name: 'Reception',
      title: 'Reception Lobby Check-in',
      instructions: 'Follow the floor path to the Reception desk. Verify your details with the front desk officer. An automated notification will be sent to your host.',
      x: 320,
      y: 110
    },
    {
      name: 'Conf. Room A',
      title: 'Meeting Destination',
      instructions: 'Follow the corridor guidance line leading towards Room 102 (Conference Room A). Open the sliding glass door. Your host is waiting for you.',
      x: 615,
      y: 110
    }
  ];

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    const savedName = localStorage.getItem('user_name');
    const savedEmail = localStorage.getItem('user_email');
    const savedCode = localStorage.getItem('qr_token');

    if (savedName) this.visitorName = savedName;
    if (savedEmail) this.visitorEmail = savedEmail;
    if (savedCode) {
      this.ticketCode = savedCode;
    }

    this.fetchVisitorDetails();
    this.updateCoordinates();
    this.isInitialLoad = false;
  }

  ngOnDestroy() {
    this.clearSimulation();
    this.stopStatusPolling();
  }

  fetchVisitorDetails() {
    if (!this.ticketCode) return;

    this.api.getVisitorByQr(this.ticketCode).subscribe({
      next: (res: any) => {
        this.visitorName = res.name;
        this.visitorEmail = res.email;
        this.visitorStatus = res.visitorStatus || 'REGISTERED';
        this.gateVerified = res.gateVerified;
        this.visitorId = res.id;

        // Generate QR code dynamically on canvas
        this.generateQrCode();

        // Setup polling if they are waiting for security verification
        if (this.visitorStatus === 'PASS_GENERATED') {
          this.startStatusPolling();
        } else {
          this.stopStatusPolling();
          if (this.visitorStatus === 'GATE_VERIFIED' && !this.showSuccessAlert) {
            this.showSuccessAlert = true;
          }
        }
      },
      error: (err) => {
        console.error("Failed to load visitor details:", err);
      }
    });
  }

  generateQrCode() {
    setTimeout(() => {
      const canvas = document.getElementById('qrCanvas') as HTMLCanvasElement;
      if (canvas && this.ticketCode) {
        QRCode.toCanvas(canvas, this.ticketCode, { width: 140, margin: 1 }, (error) => {
          if (error) console.error("Error generating QR code on canvas:", error);
        });
      }
    }, 100);
  }

  startStatusPolling() {
    this.stopStatusPolling();
    this.pollingInterval = setInterval(() => {
      if (this.ticketCode) {
        this.api.getVisitorByQr(this.ticketCode).subscribe({
          next: (res: any) => {
            const newStatus = res.visitorStatus || 'REGISTERED';
            if (newStatus !== this.visitorStatus) {
              this.visitorStatus = newStatus;
              this.gateVerified = res.gateVerified;
              
              if (newStatus === 'GATE_VERIFIED') {
                this.showSuccessAlert = true;
                this.stopStatusPolling();
              }
              this.fetchVisitorDetails();
            }
          },
          error: (err) => console.error("Error polling visitor status:", err)
        });
      }
    }, 3000);
  }

  stopStatusPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  submitReceptionCheckin() {
    if (!this.ticketCode) return;
    this.isCheckingIn = true;
    this.api.visitorCheckin(this.ticketCode, this.hostName).subscribe({
      next: () => {
        this.isCheckingIn = false;
        this.fetchVisitorDetails();
      },
      error: (err) => {
        this.isCheckingIn = false;
        alert("Reception check-in failed: " + (err.error || err.message));
      }
    });
  }

  startRouteGuidance() {
    if (!this.ticketCode) return;
    this.api.simulateZone(this.ticketCode, 'SECURITY_GATE').subscribe({
      next: () => {
        this.fetchVisitorDetails();
      },
      error: (err) => {
        console.error("Failed to start route:", err);
      }
    });
  }

  endMeeting() {
    if (!this.ticketCode) return;
    this.api.completeMeeting(this.ticketCode).subscribe({
      next: () => {
        this.fetchVisitorDetails();
      },
      error: (err) => {
        console.error("Failed to end meeting:", err);
      }
    });
  }

  getStepStatus(stepKey: string): 'completed' | 'active' | 'locked' {
    const statusOrder = ['REGISTERED', 'PASS_GENERATED', 'GATE_VERIFIED', 'RECEPTION_CHECKIN', 'HOST_APPROVED', 'ROUTE_STARTED', 'MEETING_STARTED', 'MEETING_COMPLETED', 'EXITED'];
    const currentIdx = statusOrder.indexOf(this.visitorStatus);
    
    if (stepKey === 'REGISTERED') {
      return 'completed';
    }
    if (stepKey === 'PASS_GENERATED') {
      return currentIdx >= 1 ? 'completed' : 'active';
    }
    if (stepKey === 'GATE_VERIFIED') {
      if (currentIdx > 2) return 'completed';
      if (currentIdx === 2) return 'active';
      if (currentIdx === 1) return 'active';
      return 'locked';
    }
    if (stepKey === 'RECEPTION_CHECKIN') {
      if (currentIdx > 3) return 'completed';
      if (currentIdx === 3) return 'active';
      if (currentIdx === 2) return 'active';
      return 'locked';
    }
    if (stepKey === 'HOST_APPROVED') {
      if (currentIdx > 4) return 'completed';
      if (currentIdx === 4) return 'active';
      if (currentIdx === 3) return 'active';
      return 'locked';
    }
    if (stepKey === 'ROUTE_STARTED') {
      if (currentIdx > 5) return 'completed';
      if (currentIdx === 5) return 'active';
      if (currentIdx === 4) return 'active';
      return 'locked';
    }
    if (stepKey === 'MEETING_STARTED') {
      if (currentIdx >= 7) return 'completed';
      if (currentIdx === 6) return 'active';
      if (currentIdx === 5) return 'active';
      return 'locked';
    }
    return 'locked';
  }

  navigateToGateVerification() {
    this.router.navigate(['/gate']);
  }

  updateCoordinates() {
    if (this.isDeviated) return;
    const step = this.steps[this.currentStep];
    this.dotX = step.x;
    this.dotY = step.y;

    if (!this.isInitialLoad) {
      this.speak(`${step.title}. ${step.instructions}`);
    }
    this.logBeacon(step.name);

    if (this.ticketCode) {
      const zoneName = step.name.toUpperCase().replace(/\s+/g, '_');
      this.api.simulateZone(this.ticketCode, zoneName).subscribe();
    }
  }

  nextStep() {
    if (this.isDeviated) this.isDeviated = false;
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.updateCoordinates();
    }
  }

  prevStep() {
    if (this.isDeviated) this.isDeviated = false;
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateCoordinates();
    }
  }

  resetSimulation() {
    this.clearSimulation();
    this.isDeviated = false;
    this.currentStep = 0;
    this.updateCoordinates();
  }

  toggleSimulation() {
    if (this.isSimulating) {
      this.clearSimulation();
    } else {
      this.isSimulating = true;
      this.isDeviated = false;
      this.runSimulationStep();
    }
  }

  private runSimulationStep() {
    this.simulationInterval = setInterval(() => {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++;
        this.updateCoordinates();
      } else {
        this.currentStep = 0;
        this.updateCoordinates();
      }
    }, 5000);
  }

  private clearSimulation() {
    this.isSimulating = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
  }

  speak(text: string) {
    if (this.isMuted) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  logBeacon(zoneName: string) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.beaconLog.unshift(`[${time}] BLE beacon scanned: Near ${zoneName} transmitter`);
    if (this.beaconLog.length > 5) {
      this.beaconLog.pop();
    }
  }

  toggleDeviation() {
    this.isDeviated = !this.isDeviated;
    if (this.isDeviated) {
      this.clearSimulation();

      this.dotX = 450;
      this.dotY = 240;

      const deviationMsg = "Path Deviation Warning! You have entered a restricted server room. Recalculating detour route back to reception desk.";
      this.speak(deviationMsg);

      if (this.ticketCode) {
        this.api.simulateZone(this.ticketCode, 'RESTRICTED_SERVER_ROOM', 'Restricted Server Room Intrusion!').subscribe();
      }
    } else {
      this.updateCoordinates();
    }
  }
}

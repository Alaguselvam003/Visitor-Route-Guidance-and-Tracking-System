import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

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
  imports: [CommonModule],
  templateUrl: './route-guidance.component.html',
  styleUrls: ['./route-guidance.component.css']
})
export class RouteGuidanceComponent implements OnInit, OnDestroy {
  visitorName = 'Guest Visitor';
  visitorEmail = 'visitor@company.com';
  ticketCode = 'V-1024';

  currentStep = 0;
  isSimulating = false;
  isMuted = false;
  isDeviated = false;
  beaconLog: string[] = [];

  dotX = 110;
  dotY = 160;

  constructor(private api: ApiService) {}

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

  private simulationInterval: any;

  ngOnInit() {
    const savedName = localStorage.getItem('user_name');
    const savedEmail = localStorage.getItem('user_email');
    const savedCode = localStorage.getItem('qr_token');

    if (savedName) this.visitorName = savedName;
    if (savedEmail) this.visitorEmail = savedEmail;
    if (savedCode) {
      this.ticketCode = savedCode;
    } else {
      const randomCode = Math.floor(1000 + Math.random() * 9000);
      this.ticketCode = `V-${randomCode}`;
    }

    this.updateCoordinates();
  }

  ngOnDestroy() {
    this.clearSimulation();
  }

  updateCoordinates() {
    if (this.isDeviated) return;
    const step = this.steps[this.currentStep];
    this.dotX = step.x;
    this.dotY = step.y;

    this.speak(`${step.title}. ${step.instructions}`);

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

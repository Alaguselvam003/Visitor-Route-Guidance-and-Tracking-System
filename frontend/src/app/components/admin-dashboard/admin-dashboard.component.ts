import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

interface Visitor {
  id: number;
  name: string;
  email: string;
  phone: string;
  idNumber: string;
  verified: boolean;
  qrToken?: string;
  inside: boolean;
  entryTime?: string;
  exitTime?: string;
  securityAlert?: string;
}

interface ReceptionCheckin {
  qrToken: string;
  status: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats = { total: 0, waiting: 0, approved: 0, inside: 0, exited: 0 };
  visitors: Visitor[] = [];
  receptionQueue: ReceptionCheckin[] = [];

  roomCounts = { gate: 0, reception: 0, meeting: 0 };
  searchQuery = '';

  private pollingTimer: any;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.refreshAll();

    this.pollingTimer = setInterval(() => this.refreshAll(), 5000);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }
  }

  refreshAll() {

    this.api.getDashboard().subscribe({
      next: (res) => {
        this.stats = res;
      }
    });

    this.api.getReceptionQueue().subscribe({
      next: (queue) => {
        this.receptionQueue = queue;
        this.updateRoomLocations();
      }
    });

    this.api.getVisitors().subscribe({
      next: (list) => {
        this.visitors = list.sort((a, b) => b.id - a.id);
        this.updateRoomLocations();
      }
    });
  }

  updateRoomLocations() {
    let gate = 0;
    let reception = 0;
    let meeting = 0;

    this.visitors.forEach((v) => {
      const checkin = this.receptionQueue.find(r => r.qrToken === v.qrToken);
      if (checkin) {
        if (checkin.status === 'WAITING' || checkin.status === 'APPROVED') {
          reception++;
        } else if (checkin.status === 'IN_MEETING') {
          meeting++;
        } else if (v.inside && !v.exitTime) {
          gate++;
        }
      } else if (v.inside && !v.exitTime) {
        gate++;
      }
    });

    this.roomCounts = { gate, reception, meeting };
  }

  getPeopleInRoom(room: string): string[] {
    const list: string[] = [];
    this.visitors.forEach((v) => {
      const checkin = this.receptionQueue.find(r => r.qrToken === v.qrToken);
      if (checkin) {
        if (room === 'reception' && (checkin.status === 'WAITING' || checkin.status === 'APPROVED')) {
          list.push(v.name);
        } else if (room === 'meeting' && checkin.status === 'IN_MEETING') {
          list.push(v.name);
        } else if (room === 'gate' && v.inside && !v.exitTime && checkin.status !== 'IN_MEETING' && checkin.status !== 'WAITING' && checkin.status !== 'APPROVED') {
          list.push(v.name);
        }
      } else if (room === 'gate' && v.inside && !v.exitTime) {
        list.push(v.name);
      }
    });
    return list;
  }

  getActiveAlerts(): Visitor[] {
    return this.visitors.filter((v) => !!v.securityAlert);
  }

  clearAlert(qrToken: string) {
    this.api.simulateZone(qrToken, 'GATE').subscribe({
      next: () => {
        this.refreshAll();
      }
    });
  }

  filteredVisitors(): Visitor[] {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return this.visitors;
    return this.visitors.filter(
      (v) =>
        v.name.toLowerCase().includes(query) ||
        v.email.toLowerCase().includes(query) ||
        (v.qrToken && v.qrToken.toLowerCase().includes(query))
    );
  }

  getStatusLabel(v: Visitor): string {
    if (!v.verified) return 'Unverified';
    const checkin = this.receptionQueue.find(r => r.qrToken === v.qrToken);
    if (checkin || (v.inside && !v.exitTime)) return 'Inside';
    if (v.exitTime) return 'Exited';
    return 'Registered';
  }

  getStatusClass(v: Visitor): string {
    if (!v.verified) return 'unverified';
    const checkin = this.receptionQueue.find(r => r.qrToken === v.qrToken);
    if (checkin || (v.inside && !v.exitTime)) return 'inside';
    if (v.exitTime) return 'exited';
    return 'registered';
  }

  formatTime(isoString: string): string {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  }
}

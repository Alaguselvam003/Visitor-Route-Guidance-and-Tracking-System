import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

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
  template: `
    <div class="admin-wrapper" style="max-width: 1200px; margin: 0 auto; padding: 1.5rem;">
      <!-- Header -->
      <div class="admin-header" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 1.25rem; margin-bottom: 2rem;">
        <div>
          <h2 style="color: #1f2937; margin-bottom: 0.25rem; font-size: 1.8rem;">Admin Control Center</h2>
          <p style="color: #4b5563; font-size: 0.95rem; margin: 0;">Monitor active visitor flows and verify logs.</p>
        </div>
        <button class="btn btn-outline" (click)="refreshAll()">Refresh Data</button>
      </div>

      <!-- KPI Summary Row -->
      <div class="stats-row" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
        <div class="card" style="border-top: 3px solid #3b82f6;">
          <div style="color: #4b5563; font-size: 0.8rem; text-transform: uppercase;">Total Passes Issued</div>
          <div style="font-size: 2rem; color: #1f2937; font-weight: bold; margin-top: 0.5rem;">{{ stats.total }}</div>
        </div>
        <div class="card" style="border-top: 3px solid #10b981;">
          <div style="color: #4b5563; font-size: 0.8rem; text-transform: uppercase;">Visitors Inside</div>
          <div style="font-size: 2rem; color: #10b981; font-weight: bold; margin-top: 0.5rem;">{{ stats.inside }}</div>
        </div>
        <div class="card" style="border-top: 3px solid #eab308;">
          <div style="color: #4b5563; font-size: 0.8rem; text-transform: uppercase;">Queue at Reception</div>
          <div style="font-size: 2rem; color: #eab308; font-weight: bold; margin-top: 0.5rem;">{{ stats.waiting }}</div>
        </div>
        <div class="card" style="border-top: 3px solid #6c757d;">
          <div style="color: #4b5563; font-size: 0.8rem; text-transform: uppercase;">Exited Visitors</div>
          <div style="font-size: 2rem; color: #4b5563; font-weight: bold; margin-top: 0.5rem;">{{ stats.exited }}</div>
        </div>
      </div>

      <!-- Security Alerts Flashing Banner -->
      <div *ngIf="getActiveAlerts().length > 0" class="card animate-fade-in" style="border: 2px solid #ef4444; background: #fee2e2; margin-bottom: 2rem; padding: 1.5rem; border-radius: 8px;">
        <div style="display: flex; align-items: center; gap: 0.75rem; color: #b91c1c; margin-bottom: 0.75rem;">
          <span style="font-size: 1.5rem;">🚨</span>
          <h3 style="margin: 0; font-size: 1.15rem; font-weight: bold;">SECURITY ALERTS DETECTED</h3>
        </div>
        <div style="max-height: 150px; overflow-y: auto;">
          <div *ngFor="let alert of getActiveAlerts()" style="background: #ffffff; border-left: 4px solid #ef4444; padding: 0.75rem 1rem; border-radius: 6px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; border-top: 1px solid #f3f4f6; border-right: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;">
            <span>
              <strong style="color: #111827;">{{ alert.name }}</strong> ({{ alert.qrToken }}): 
              <span style="color: #b91c1c; font-weight: bold; font-family: monospace; margin-left: 0.5rem;">{{ alert.securityAlert }}</span>
            </span>
            <button class="btn" style="background: #f3f4f6; color: #374151; padding: 0.25rem 0.6rem; font-size: 0.75rem; border: 1px solid #cbd5e1; border-radius: 4px;" (click)="clearAlert(alert.qrToken!)">Acknowledge</button>
          </div>
        </div>
      </div>

      <!-- Live Map Card -->
      <div class="card" style="margin-bottom: 2rem;">
        <h3 style="color: #1f2937; font-size: 1.15rem; margin-bottom: 1.25rem;">Live Visitor Tracking Map</h3>
        
        <div style="border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden;">
          <svg viewBox="0 0 800 320" width="100%" style="display: block; background: #f1f5f9;">
            <!-- Security Gate -->
            <rect x="50" y="80" width="160" height="150" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
            <text x="130" y="140" fill="#1e293b" font-size="13" font-weight="500" text-anchor="middle">Security Gate</text>
            <text x="130" y="175" fill="#3b82f6" font-size="12" font-weight="bold" text-anchor="middle">{{ roomCounts.gate }} present</text>

            <!-- Reception -->
            <rect x="310" y="50" width="180" height="120" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
            <text x="400" y="105" fill="#1e293b" font-size="13" font-weight="500" text-anchor="middle">Reception Desk</text>
            <text x="400" y="135" fill="#4b5563" font-size="12" font-weight="bold" text-anchor="middle">{{ roomCounts.reception }} present</text>

            <!-- Conference Room A -->
            <rect x="590" y="80" width="160" height="150" rx="6" fill="#e2e8f0" stroke="#94a3b8" stroke-width="2" />
            <text x="670" y="140" fill="#1e293b" font-size="13" font-weight="500" text-anchor="middle">Conf. Room A</text>
            <text x="670" y="175" fill="#10b981" font-size="12" font-weight="bold" text-anchor="middle">{{ roomCounts.meeting }} present</text>
          </svg>
        </div>

        <!-- Room Occupancy Details -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-top: 1.5rem;">
          <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; border: 1px solid #cbd5e1;">
            <strong style="color: #3b82f6; font-size: 0.9rem; display: block; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">At Security Gate ({{ roomCounts.gate }})</strong>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.85rem; color: #4b5563; line-height: 1.5;">
              <li *ngFor="let name of getPeopleInRoom('gate')">{{ name }}</li>
              <li *ngIf="getPeopleInRoom('gate').length === 0" style="list-style: none; margin-left: -1.2rem; color: #94a3b8;">No visitors present</li>
            </ul>
          </div>
          <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; border: 1px solid #cbd5e1;">
            <strong style="color: #6b7280; font-size: 0.9rem; display: block; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">At Reception Desk ({{ roomCounts.reception }})</strong>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.85rem; color: #4b5563; line-height: 1.5;">
              <li *ngFor="let name of getPeopleInRoom('reception')">{{ name }}</li>
              <li *ngIf="getPeopleInRoom('reception').length === 0" style="list-style: none; margin-left: -1.2rem; color: #94a3b8;">No visitors present</li>
            </ul>
          </div>
          <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; border: 1px solid #cbd5e1;">
            <strong style="color: #10b981; font-size: 0.9rem; display: block; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 0.5rem;">In Conference Room A ({{ roomCounts.meeting }})</strong>
            <ul style="margin: 0; padding-left: 1.2rem; font-size: 0.85rem; color: #4b5563; line-height: 1.5;">
              <li *ngFor="let name of getPeopleInRoom('meeting')">{{ name }}</li>
              <li *ngIf="getPeopleInRoom('meeting').length === 0" style="list-style: none; margin-left: -1.2rem; color: #94a3b8;">No visitors present</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Visitor Directory Card -->
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <h3 style="color: #1f2937; font-size: 1.15rem; margin: 0;">Visitor Log Directory</h3>
          <input type="text" class="form-control" [(ngModel)]="searchQuery" placeholder="Search visitors..." style="max-width: 280px; padding: 0.5rem 0.75rem; border: 1px solid #cbd5e1;">
        </div>

        <div style="overflow-x: auto;">
          <table class="directory-table" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid #cbd5e1; color: #4b5563; font-size: 0.85rem;">
                <th style="padding: 0.75rem 1rem;">Name</th>
                <th style="padding: 0.75rem 1rem;">Email & Phone</th>
                <th style="padding: 0.75rem 1rem;">ID Number</th>
                <th style="padding: 0.75rem 1rem;">Pass Code</th>
                <th style="padding: 0.75rem 1rem;">Entry/Exit Log</th>
                <th style="padding: 0.75rem 1rem;">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of filteredVisitors()" style="border-bottom: 1px solid #e5e7eb; color: #1f2937; font-size: 0.9rem;">
                <td style="padding: 1rem; font-weight: 500;">{{ item.name }}</td>
                <td style="padding: 1rem; line-height: 1.4;">
                  <div>{{ item.email }}</div>
                  <div style="font-size: 0.8rem; color: #4b5563;">{{ item.phone }}</div>
                </td>
                <td style="padding: 1rem; color: #4b5563;">{{ item.idNumber || '-' }}</td>
                <td style="padding: 1rem; font-family: monospace; font-weight: bold; color: #3b82f6;">{{ item.qrToken || 'Wait OTP' }}</td>
                <td style="padding: 1rem; font-size: 0.8rem; line-height: 1.4; color: #4b5563;">
                  <div *ngIf="item.entryTime">IN: {{ formatTime(item.entryTime) }}</div>
                  <div *ngIf="item.exitTime">OUT: {{ formatTime(item.exitTime) }}</div>
                  <div *ngIf="!item.entryTime && !item.exitTime" style="color: #94a3b8;">No logs recorded</div>
                </td>
                <td style="padding: 1rem;">
                  <span [ngClass]="'status-badge ' + getStatusClass(item)">
                    {{ getStatusLabel(item) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .directory-table tr:hover {
      background: rgba(0, 0, 0, 0.01);
    }
    .status-badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .status-badge.inside {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid #10b981;
      color: #065f46;
    }
    .status-badge.exited {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid #3b82f6;
      color: #1d4ed8;
    }
    .status-badge.registered {
      background: rgba(107, 114, 128, 0.1);
      border: 1px solid #6b7280;
      color: #374151;
    }
    .status-badge.unverified {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid #ef4444;
      color: #991b1b;
    }
  `]
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  stats = { total: 0, waiting: 0, approved: 0, inside: 0, exited: 0 };
  visitors: Visitor[] = [];
  receptionQueue: ReceptionCheckin[] = [];
  
  roomCounts = { gate: 0, reception: 0, meeting: 0 };
  searchQuery = '';
  
  private pollingTimer: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.refreshAll();
    // Set up active polling every 5 seconds to simulate real-time tracking
    this.pollingTimer = setInterval(() => this.refreshAll(), 5000);
  }

  ngOnDestroy() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }
  }

  refreshAll() {
    // 1. Fetch KPI Statistics
    this.api.getDashboard().subscribe({
      next: (res) => {
        this.stats = res;
      }
    });

    // 2. Fetch Reception Queue to check positions
    this.api.getReceptionQueue().subscribe({
      next: (queue) => {
        this.receptionQueue = queue;
        this.updateRoomLocations();
      }
    });

    // 3. Fetch Full Visitor Directory
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

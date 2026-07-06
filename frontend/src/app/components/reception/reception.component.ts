import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface ReceptionItem {
  id: number;
  qrToken: string;
  hostName: string;
  status: string;
  checkinTime: string;
  meetingStartTime?: string;
  meetingEndTime?: string;
  nfcTag?: string;
}

@Component({
  selector: 'app-reception',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 2rem;">
      <div class="dashboard-header animate-fade-in" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--surface-border); padding-bottom: 1.5rem; margin-bottom: 2rem;">
        <div>
          <h2 style="color: var(--primary-color); margin-bottom: 0.5rem; font-size: 2rem;">Reception Desk Dashboard</h2>
          <p style="color: var(--text-secondary);">Manage incoming visitor queues, host approvals, and meeting timings.</p>
        </div>
        <button class="btn btn-outline" (click)="loadQueue()">🔄 Refresh Queue</button>
      </div>

      <div *ngIf="alertMsg" class="alert" [ngClass]="'alert-' + alertType" style="margin-bottom: 1.5rem; padding: 1rem; border-radius: 10px;">
        {{ alertMsg }}
      </div>

      <div class="dashboard-grid" style="display: grid; grid-template-columns: 1fr 2.5fr; gap: 2rem;">
        
        <!-- Left: Check-in Form -->
        <div class="glass-panel animate-fade-in" style="padding: 2rem; height: fit-content; animation-delay: 0.1s;">
          <h3 style="color: var(--text-primary); margin-bottom: 1.5rem; font-size: 1.25rem;">New Reception Entry</h3>
          <form (ngSubmit)="onCheckin()">
            <div class="form-group">
              <label class="form-label">Visitor QR Token</label>
              <input type="text" class="form-control" [(ngModel)]="newCheckin.qrToken" name="qrToken" required placeholder="e.g. V-9402">
            </div>
            <div class="form-group">
              <label class="form-label">Meeting Host Name</label>
              <input type="text" class="form-control" [(ngModel)]="newCheckin.host" name="host" required placeholder="e.g. Dr. Jane Smith">
            </div>
            <button type="submit" class="btn btn-primary btn-block" [disabled]="isLoading" style="margin-top: 1rem;">
              {{ isLoading ? 'Checking in...' : 'Add to Queue' }}
            </button>
          </form>
        </div>

        <!-- Right: Active Queue List -->
        <div class="glass-panel animate-fade-in" style="padding: 2rem; overflow-x: auto; animation-delay: 0.2s;">
          <h3 style="color: var(--text-primary); margin-bottom: 1.5rem; font-size: 1.25rem;">Active Reception Queue</h3>
          
          <div *ngIf="queue.length === 0" style="text-align: center; padding: 3rem 0; color: var(--text-secondary);">
            <span style="font-size: 2.5rem; display: block; margin-bottom: 1rem;">👥</span>
            <p>The queue is currently empty. Incoming visitors checked in at reception will appear here.</p>
          </div>

          <table *ngIf="queue.length > 0" class="reception-table" style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid var(--surface-border); color: var(--text-secondary); font-size: 0.9rem;">
                <th style="padding: 0.75rem 1rem;">QR Token</th>
                <th style="padding: 0.75rem 1rem;">Host</th>
                <th style="padding: 0.75rem 1rem;">Check-in Time</th>
                <th style="padding: 0.75rem 1rem;">Status</th>
                <th style="padding: 0.75rem 1rem; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of queue" style="border-bottom: 1px solid #e5e7eb; color: var(--text-primary); font-size: 0.95rem;">
                <td style="padding: 1rem; font-family: monospace; font-weight: 700; color: var(--primary-color);">{{ item.qrToken }}</td>
                <td style="padding: 1rem;">{{ item.hostName }}</td>
                <td style="padding: 1rem; color: var(--text-secondary); font-size: 0.85rem;">{{ formatTime(item.checkinTime) }}</td>
                <td style="padding: 1rem;">
                  <span [ngClass]="'status-badge ' + item.status.toLowerCase()">
                    {{ item.status }}
                  </span>
                </td>
                <td style="padding: 1rem; text-align: right; display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
                  <!-- Actions based on status -->
                  <ng-container *ngIf="item.status === 'WAITING'">
                    <button class="btn-sm btn-approve" (click)="updateStatus(item.qrToken, 'APPROVE')">Approve</button>
                    <button class="btn-sm btn-reject" (click)="updateStatus(item.qrToken, 'REJECT')">Reject</button>
                  </ng-container>
                  <ng-container *ngIf="item.status === 'APPROVED'">
                    <div style="display: flex; align-items: center; gap: 0.25rem; justify-content: flex-end;">
                      <input type="number" [(ngModel)]="meetingDurations[item.qrToken]" style="width: 60px; padding: 0.2rem 0.4rem; border-radius: 4px; border: 1px solid #cbd5e1; font-size: 0.85rem; text-align: center;" placeholder="Mins">
                      <button class="btn-sm btn-start" (click)="startMeetingWithDuration(item.qrToken)">Start</button>
                    </div>
                  </ng-container>
                  <ng-container *ngIf="item.status === 'IN_MEETING'">
                    <span style="color: var(--success-color); font-size: 0.85rem; font-weight: 500;">Meeting Active</span>
                  </ng-container>
                  <ng-container *ngIf="item.status === 'APPROVED' || item.status === 'IN_MEETING'">
                    <button *ngIf="!item.nfcTag" class="btn-sm btn-outline" (click)="printNfcTag(item.qrToken)">Print NFC</button>
                    <span *ngIf="item.nfcTag" style="font-size: 0.75rem; background: #e0f2fe; color: #0369a1; padding: 0.2rem 0.5rem; border-radius: 4px; font-family: monospace; font-weight: 700;">
                      {{ item.nfcTag }}
                    </span>
                  </ng-container>
                  <ng-container *ngIf="item.status === 'COMPLETED'">
                    <span style="color: var(--text-secondary); font-size: 0.85rem;">Visit Complete</span>
                  </ng-container>
                  <ng-container *ngIf="item.status === 'REJECTED'">
                    <span style="color: var(--error-color); font-size: 0.85rem;">Denied</span>
                  </ng-container>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .reception-table th { font-weight: 500; }
    .reception-table tr:hover { background: rgba(0, 0, 0, 0.015); }
    
    /* Badges */
    .status-badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .status-badge.waiting {
      background: #fef9c3;
      border: 1px solid #eab308;
      color: #854d0e;
    }
    .status-badge.approved {
      background: #dbeafe;
      border: 1px solid var(--primary-color);
      color: #1e40af;
    }
    .status-badge.in_meeting {
      background: #e0f2fe;
      border: 1px solid #0284c7;
      color: #075985;
    }
    .status-badge.completed {
      background: #d1fae5;
      border: 1px solid var(--success-color);
      color: #065f46;
    }
    .status-badge.rejected {
      background: #fee2e2;
      border: 1px solid var(--error-color);
      color: #991b1b;
    }

    /* Small action buttons */
    .btn-sm {
      padding: 0.35rem 0.75rem;
      font-size: 0.8rem;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    .btn-approve {
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid var(--success-color);
      color: #065f46;
    }
    .btn-approve:hover {
      background: var(--success-color);
      color: white;
    }
    .btn-reject {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid var(--error-color);
      color: #991b1b;
    }
    .btn-reject:hover {
      background: var(--error-color);
      color: white;
    }
    .btn-start {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid var(--primary-color);
      color: #1d4ed8;
    }
    .btn-start:hover {
      background: var(--primary-color);
      color: white;
    }
  `]
})
export class ReceptionComponent implements OnInit {
  queue: ReceptionItem[] = [];
  newCheckin = { qrToken: '', host: '' };
  isLoading = false;
  meetingDurations: { [key: string]: number } = {};
  
  alertMsg = '';
  alertType = 'success';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadQueue();
  }

  showAlert(msg: string, type: 'success' | 'error') {
    this.alertMsg = msg;
    this.alertType = type;
    setTimeout(() => this.alertMsg = '', 5000);
  }

  loadQueue() {
    this.api.getReceptionQueue().subscribe({
      next: (data) => {
        this.queue = data.sort((a, b) => b.id - a.id);
      },
      error: (err) => {
        this.showAlert('Failed to load reception queue.', 'error');
      }
    });
  }

  onCheckin() {
    if (!this.newCheckin.qrToken || !this.newCheckin.host) return;
    this.isLoading = true;
    this.api.checkin(this.newCheckin.qrToken, this.newCheckin.host).subscribe({
      next: (res) => {
        this.showAlert(res || 'Checkin completed successfully!', 'success');
        this.newCheckin = { qrToken: '', host: '' };
        this.loadQueue();
        this.isLoading = false;
      },
      error: (err) => {
        this.showAlert('Checkin failed: ' + (err.error || 'Invalid details'), 'error');
        this.isLoading = false;
      }
    });
  }

  updateStatus(qrToken: string, status: string) {
    this.api.approveVisitor(qrToken, status).subscribe({
      next: (res) => {
        this.showAlert(res || `Visitor ${status.toLowerCase()}d successfully!`, 'success');
        this.loadQueue();
      },
      error: (err) => {
        this.showAlert('Approval action failed.', 'error');
      }
    });
  }

  startMeetingWithDuration(qrToken: string) {
    const duration = this.meetingDurations[qrToken] || 30;
    if (duration <= 0) {
      this.showAlert('Please enter a valid meeting duration in minutes.', 'error');
      return;
    }

    this.api.startMeeting(qrToken, duration).subscribe({
      next: (res) => {
        this.showAlert(res || 'Meeting started successfully!', 'success');
        this.loadQueue();
      },
      error: (err) => {
        this.showAlert('Failed to start meeting.', 'error');
      }
    });
  }

  printNfcTag(qrToken: string) {
    const randomNfc = 'NFC-' + Math.floor(1000 + Math.random() * 9000);
    this.api.assignNfc(qrToken, randomNfc).subscribe({
      next: (res) => {
        this.showAlert(`NFC Card ${randomNfc} printed and assigned successfully!`, 'success');
        this.loadQueue();
      },
      error: (err) => {
        this.showAlert('Failed to assign NFC tag.', 'error');
      }
    });
  }

  formatTime(isoString: string): string {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  }
}

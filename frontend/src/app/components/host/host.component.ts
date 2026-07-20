import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="host-container" style="padding: 2rem; max-width: 900px; margin: 2rem auto; font-family: 'Outfit', sans-serif;">
      
      <!-- Header -->
      <div class="header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem;">
        <div>
          <h1 style="margin: 0; color: #1e293b; font-size: 1.8rem; font-weight: 600;">Welcome, {{ hostName }}</h1>
          <p style="margin: 0.25rem 0 0; color: #64748b; font-size: 0.95rem;">Manage approvals for visitors waiting to meet you</p>
        </div>
        <button class="btn btn-outline" (click)="logout()" style="padding: 0.5rem 1rem;">Sign Out</button>
      </div>

      <!-- Alert messages -->
      <div *ngIf="alertMsg" class="alert mt-4" [ngClass]="'alert-' + alertType" style="padding: 1rem; border-radius: 8px; font-weight: 500; margin-bottom: 1.5rem;">
        {{ alertMsg }}
      </div>

      <!-- Main Layout -->
      <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.75rem; margin-bottom: 1.25rem;">
          <h3 style="margin: 0; color: #334155; font-size: 1.2rem; font-weight: 600;">Visitor Requests Waiting for You</h3>
          <button class="btn btn-outline" (click)="fetchWaitingVisitors()" style="padding: 0.35rem 0.75rem; font-size: 0.85rem;">Refresh List</button>
        </div>

        <!-- Waiting Visitors List -->
        <div *ngIf="waitingList.length > 0; else emptyState">
          <div *ngFor="let item of waitingList" class="visitor-item" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 1rem; background: #f8fafc;">
            <div>
              <p style="margin: 0; font-size: 1.05rem; font-weight: 600; color: #1e293b;">Pass Code: {{ item.qrToken }}</p>
              <span style="font-size: 0.82rem; color: #64748b;">Checked-in at: {{ item.checkinTime | date:'shortTime' }}</span>
            </div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-primary" (click)="approveVisitor(item.qrToken)" style="padding: 0.5rem 1.25rem; font-size: 0.88rem; font-weight: 500; border-radius: 6px;">
                Approve Entry
              </button>
            </div>
          </div>
        </div>

        <ng-template #emptyState>
          <div style="text-align: center; padding: 3rem 0; color: #94a3b8;">
            <span style="font-size: 3rem; display: block; margin-bottom: 0.75rem;">🎉</span>
            <p style="margin: 0; font-size: 1.05rem; font-weight: 500; color: #64748b;">No visitors waiting for you right now.</p>
            <p style="margin: 0.25rem 0 0; font-size: 0.88rem; color: #94a3b8;">We'll show them here when someone checks in at Reception.</p>
          </div>
        </ng-template>
      </div>

    </div>
  `
})
export class HostComponent implements OnInit {
  hostName = 'Meeting Host';
  waitingList: any[] = [];
  alertMsg = '';
  alertType = 'success';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      this.hostName = savedName;
    }
    this.fetchWaitingVisitors();
  }

  fetchWaitingVisitors() {
    this.api.getHostWaiting(this.hostName).subscribe({
      next: (res) => {
        this.waitingList = res;
      },
      error: (err) => {
        this.showAlert('Failed to fetch waiting list: ' + (err.error || err.message), 'error');
      }
    });
  }

  approveVisitor(qrToken: string) {
    this.api.hostApproveVisitor(qrToken).subscribe({
      next: (res) => {
        this.showAlert('Visitor entry approved successfully!', 'success');
        this.fetchWaitingVisitors();
      },
      error: (err) => {
        this.showAlert('Approval failed: ' + (err.error || err.message), 'error');
      }
    });
  }

  showAlert(msg: string, type: string) {
    this.alertMsg = msg;
    this.alertType = type;
    setTimeout(() => {
      this.alertMsg = '';
    }, 4000);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

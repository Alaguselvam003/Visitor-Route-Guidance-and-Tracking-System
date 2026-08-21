import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

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
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.css']
})
export class ReceptionComponent implements OnInit {
  queue: ReceptionItem[] = [];
  newCheckin = { qrToken: '', host: '' };
  isLoading = false;
  meetingDurations: { [key: string]: number } = {};
  
  alertMsg = '';
  alertType = 'success';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadQueue();
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
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

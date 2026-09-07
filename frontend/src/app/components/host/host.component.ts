import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {
  hostName = 'Meeting Host';
  selectedTab: 'waiting' | 'active' | 'completed' = 'waiting';
  
  waitingList: any[] = [];
  activeList: any[] = [];
  completedList: any[] = [];
  allMeetings: any[] = [];
  
  isLoading = false;
  alertMsg = '';
  alertType = 'success';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      this.hostName = savedName;
    }
    this.fetchAllHostData();
  }

  fetchAllHostData() {
    this.isLoading = true;
    this.api.getHostMeetings(this.hostName).subscribe({
      next: (res: any[]) => {
        this.isLoading = false;
        this.allMeetings = (res || []).sort((a, b) => b.id - a.id);
        
        this.waitingList = this.allMeetings.filter(item => 
          item.status === 'WAITING'
        );

        this.activeList = this.allMeetings.filter(item => 
          item.status === 'APPROVED' || 
          item.status === 'IN_MEETING' || 
          item.status === 'HOST_APPROVED' || 
          item.status === 'ROUTE_STARTED' || 
          item.status === 'MEETING_STARTED'
        );

        this.completedList = this.allMeetings.filter(item => 
          item.status === 'COMPLETED' || 
          item.status === 'MEETING_COMPLETED' ||
          item.status === 'REJECTED'
        );
      },
      error: (err) => {
        this.isLoading = false;
        this.showAlert('Failed to fetch host meetings: ' + (err.error || err.message), 'error');
      }
    });
  }

  approveVisitor(qrToken: string) {
    this.api.hostApproveVisitor(qrToken).subscribe({
      next: (res) => {
        this.showAlert('✓ Visitor entry approved successfully! Visitor may now navigate to the meeting room.', 'success');
        this.fetchAllHostData();
      },
      error: (err) => {
        this.showAlert('Approval failed: ' + (err.error || err.message), 'error');
      }
    });
  }

  rejectVisitor(qrToken: string) {
    this.api.hostRejectVisitor(qrToken).subscribe({
      next: (res) => {
        this.showAlert('Visitor request rejected.', 'error');
        this.fetchAllHostData();
      },
      error: (err) => {
        this.showAlert('Action failed: ' + (err.error || err.message), 'error');
      }
    });
  }

  completeMeeting(qrToken: string) {
    this.api.hostCompleteMeeting(qrToken).subscribe({
      next: (res) => {
        this.showAlert('✓ Visitor meeting marked as completed successfully!', 'success');
        this.fetchAllHostData();
      },
      error: (err) => {
        this.showAlert('Failed to complete meeting: ' + (err.error || err.message), 'error');
      }
    });
  }

  showAlert(msg: string, type: string) {
    this.alertMsg = msg;
    this.alertType = type;
    setTimeout(() => {
      this.alertMsg = '';
    }, 4500);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

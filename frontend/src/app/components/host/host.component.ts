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

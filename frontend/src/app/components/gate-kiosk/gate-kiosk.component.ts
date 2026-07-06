import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-gate-kiosk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
      <div class="glass-panel" style="padding: 3rem; text-align: center; width: 100%; max-width: 500px;">
        <h2 style="color: var(--primary-color);">Gate Kiosk</h2>
        <p>Please enter your QR token to verify access.</p>
        
        <div class="form-group mt-4">
          <input type="text" class="form-control" [(ngModel)]="token" placeholder="e.g. V-1042" style="text-align: center;">
        </div>
        
        <button class="btn btn-primary mt-4" (click)="onVerify()">Verify Pass</button>
        
        <div *ngIf="resultMsg" class="alert mt-4" [ngClass]="'alert-' + resultType">{{ resultMsg }}</div>
      </div>
    </div>
  `
})
export class GateKioskComponent {
  token = '';
  resultMsg = '';
  resultType = '';

  constructor(private api: ApiService) {}

  onVerify() {
    this.api.gateEntry(this.token, 'Main_Gate').subscribe({
      next: (res) => {
        this.resultType = 'success';
        this.resultMsg = 'Access Granted! ' + res;
      },
      error: (err) => {
        this.resultType = 'error';
        this.resultMsg = 'Access Denied: Invalid Pass.';
      }
    });
  }
}

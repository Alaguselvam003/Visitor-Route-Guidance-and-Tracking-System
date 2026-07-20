import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { Html5QrcodeScanner } from 'html5-qrcode';

@Component({
  selector: 'app-gate-kiosk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="kiosk-container" style="padding: 2rem; max-width: 800px; margin: 2rem auto; font-family: 'Outfit', sans-serif;">
      
      <div class="header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 2px solid #e2e8f0; padding-bottom: 1rem;">
        <div>
          <h1 style="margin: 0; color: #1e293b; font-size: 1.8rem; font-weight: 600;">Gate Entry Kiosk</h1>
          <p style="margin: 0.25rem 0 0; color: #64748b; font-size: 0.95rem;">Scan QR code or enter pass code manually to verify visitor entry</p>
        </div>
        <button class="btn btn-outline" (click)="goBack()" style="padding: 0.5rem 1rem;">Back to Dashboard</button>
      </div>

      <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem; align-items: start;">
        
        <!-- Search and Scanning Panel -->
        <div class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
          <h3 style="margin-top: 0; margin-bottom: 1rem; color: #334155; font-size: 1.1rem; font-weight: 500;">Verify Pass Code</h3>
          
          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
            <input type="text" class="form-control" [(ngModel)]="token" placeholder="Enter pass code (e.g. VP-2026-000105)" style="flex: 1; padding: 0.75rem; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.95rem;">
            <button class="btn btn-primary" (click)="fetchVisitor()" [disabled]="!token" style="padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 500; font-size: 0.95rem;">Find Pass</button>
          </div>

          <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px; padding: 1rem;">
            <div id="reader" style="width: 100%; border: none;"></div>
          </div>
        </div>

        <!-- Visitor Info Card (Visible after scanning / entering code) -->
        <div *ngIf="visitor" class="card" style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);">
          <h3 style="margin-top: 0; margin-bottom: 1rem; color: #334155; font-size: 1.1rem; font-weight: 500; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem;">Visitor Details</h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <span style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 0.25rem;">Visitor Name</span>
              <span style="font-size: 1rem; color: #1e293b; font-weight: 500;">{{ visitor.name }}</span>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 0.25rem;">Pass Code</span>
              <span style="font-size: 1rem; color: #1e293b; font-weight: 500; font-family: monospace;">{{ visitor.passCode || visitor.qrToken }}</span>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 0.25rem;">Current Status</span>
              <span class="badge" [style.background]="getStatusColor(visitor.visitorStatus)" style="color: white; padding: 0.25rem 0.5rem; font-size: 0.8rem; font-weight: 500; border-radius: 4px; display: inline-block;">
                {{ visitor.visitorStatus }}
              </span>
            </div>
            <div>
              <span style="font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 0.25rem;">Verification Status</span>
              <span [style.color]="visitor.gateVerified ? '#10b981' : '#f59e0b'" style="font-size: 0.95rem; font-weight: 600;">
                {{ visitor.gateVerified ? '✅ VERIFIED' : '⏳ PENDING SECURITY' }}
              </span>
            </div>
          </div>

          <div *ngIf="!visitor.gateVerified" style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" (click)="confirmVerification()" style="flex: 1; padding: 0.75rem; border-radius: 8px; font-weight: 500;">
              Confirm Security Verification
            </button>
          </div>
          <div *ngIf="visitor.gateVerified" style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 0.75rem; text-align: center; color: #065f46; font-weight: 500;">
            ✓ Security verification completed. Visitor may proceed to Reception.
          </div>
        </div>

        <div *ngIf="resultMsg" class="alert" [ngClass]="'alert-' + resultType" style="padding: 1rem; border-radius: 8px; font-weight: 500;">
          {{ resultMsg }}
        </div>
      </div>
    </div>
  `
})
export class GateKioskComponent implements OnInit, OnDestroy {
  token = '';
  visitor: any = null;
  resultMsg = '';
  resultType = '';
  scanner: any = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.initScanner();
    }, 100);
  }

  ngOnDestroy() {
    this.destroyScanner();
  }

  initScanner() {
    try {
      this.scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, rememberLastUsedCamera: true },
        false
      );
      this.scanner.render(
        (decodedText: string) => this.onScanSuccess(decodedText),
        (err: any) => {}
      );
    } catch (e) {
      console.error('Failed to initialize QR scanner:', e);
    }
  }

  destroyScanner() {
    if (this.scanner) {
      this.scanner.clear().catch((err: any) => console.error("Error clearing scanner:", err));
      this.scanner = null;
    }
  }

  onScanSuccess(decodedText: string) {
    this.token = decodedText;
    this.fetchVisitor();
  }

  fetchVisitor() {
    this.resultMsg = '';
    this.visitor = null;
    
    this.api.getVisitorByQr(this.token).subscribe({
      next: (res) => {
        this.visitor = res;
      },
      error: (err) => {
        this.resultType = 'error';
        this.resultMsg = 'Invalid Pass: Visitor details not found for this pass code.';
      }
    });
  }

  confirmVerification() {
    this.resultMsg = '';
    this.api.verifyPassCode(this.token).subscribe({
      next: (res) => {
        this.resultType = 'success';
        this.resultMsg = 'Security verification completed. Visitor may now proceed to Reception.';
        if (this.visitor) {
          this.visitor.gateVerified = true;
          this.visitor.visitorStatus = 'GATE_VERIFIED';
        }
        
        // Auto redirect back to dashboard if role is VISITOR
        const userRole = localStorage.getItem('user_role');
        if (userRole === 'VISITOR') {
          setTimeout(() => {
            this.router.navigate(['/route-guidance']);
          }, 2000);
        }
      },
      error: (err) => {
        this.resultType = 'error';
        this.resultMsg = 'Verification failed: ' + (err.error || 'Server error.');
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'REGISTERED': return '#64748b';
      case 'PASS_GENERATED': return '#3b82f6';
      case 'GATE_VERIFIED': return '#06b6d4';
      case 'RECEPTION_CHECKIN': return '#f59e0b';
      case 'HOST_APPROVED': return '#8b5cf6';
      case 'ROUTE_STARTED': return '#d946ef';
      case 'MEETING_STARTED': return '#10b981';
      case 'MEETING_COMPLETED': return '#1e293b';
      case 'EXITED': return '#374151';
      default: return '#64748b';
    }
  }

  goBack() {
    const role = localStorage.getItem('user_role');
    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (role === 'VISITOR') {
      this.router.navigate(['/route-guidance']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}

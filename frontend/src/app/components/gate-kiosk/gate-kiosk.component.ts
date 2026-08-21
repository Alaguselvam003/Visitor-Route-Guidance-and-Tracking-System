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
  templateUrl: './gate-kiosk.component.html',
  styleUrls: ['./gate-kiosk.component.css']
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

  logout() {
    this.destroyScanner();
    localStorage.clear();
    this.router.navigate(['/login']);
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

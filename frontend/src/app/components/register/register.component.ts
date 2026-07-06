import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  user = { name: '', email: '', phone: '', idNumber: '', password: '' };
  otp = '';
  showOtpForm = false;
  isLoading = false;
  alertMsg = '';
  alertType = 'error';

  constructor(private api: ApiService, private router: Router) {}

  showAlert(msg: string, type: string) {
    this.alertMsg = msg;
    this.alertType = type;
  }

  onRegister() {
    this.isLoading = true;
    this.api.register(this.user).subscribe({
      next: (res) => {
        if (res && res.includes('Registration Failed')) {
          this.showAlert(res, 'error');
          this.isLoading = false;
        } else {
          this.showAlert('Registration successful! Check email for OTP.', 'success');
          this.showOtpForm = true;
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.showAlert('Registration failed', 'error');
        this.isLoading = false;
      }
    });
  }

  onVerify() {
    this.isLoading = true;
    this.api.verifyOtp(this.user.email, this.otp).subscribe({
      next: (res) => {
        this.showAlert('OTP Verified successfully! Please log in.', 'success');
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.showAlert('Invalid OTP', 'error');
        this.isLoading = false;
      }
    });
  }
}

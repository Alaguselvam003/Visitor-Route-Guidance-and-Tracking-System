import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { name: '', email: '', phone: '', idNumber: '', password: '' };
  countryCode = '+91';
  otpExpiryMinutes = 5;
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
    if (!this.user.email || !this.user.email.toLowerCase().endsWith('@gmail.com')) {
      this.showAlert('Email address must end with @gmail.com', 'error');
      return;
    }

    if (!this.user.phone || !/^\d{10}$/.test(this.user.phone)) {
      this.showAlert('Phone number must contain exactly 10 digits', 'error');
      return;
    }

    const password = this.user.password || '';
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);
    if (password.length < 6 || !hasSpecialChar) {
      this.showAlert('Password must be at least 6 characters long and contain at least one special character', 'error');
      return;
    }

    this.isLoading = true;
    const fullPhone = this.countryCode + this.user.phone;
    const registerPayload = {
      ...this.user,
      phone: fullPhone,
      otpExpiryMinutes: Number(this.otpExpiryMinutes)
    };

    this.api.register(registerPayload).subscribe({
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
        if (res && res.includes('Successfully')) {
          this.showAlert('OTP Verified successfully! Please log in.', 'success');
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.showAlert(res || 'Invalid OTP', 'error');
          this.isLoading = false;
        }
      },
      error: (err) => {
        this.showAlert('Invalid OTP', 'error');
        this.isLoading = false;
      }
    });
  }
}

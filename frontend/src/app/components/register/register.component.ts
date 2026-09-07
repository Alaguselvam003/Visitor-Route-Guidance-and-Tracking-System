import { Component, OnDestroy } from '@angular/core';
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
export class RegisterComponent implements OnDestroy {
  user = { name: '', email: '', phone: '', idNumber: '', password: '' };
  countryCode = '+91';
  otp = '';
  showOtpForm = false;
  isLoading = false;
  isResending = false;
  alertMsg = '';
  alertType = 'error';

  otpTimerSeconds = 180; // 3-minute countdown timer
  timerDisplay = '03:00';
  private timerInterval: any = null;

  constructor(private api: ApiService, private router: Router) {}

  ngOnDestroy() {
    this.stopOtpTimer();
  }

  showAlert(msg: string, type: string) {
    this.alertMsg = msg;
    this.alertType = type;
  }

  startOtpTimer() {
    this.stopOtpTimer();
    this.otpTimerSeconds = 180;
    this.updateTimerDisplay();

    this.timerInterval = setInterval(() => {
      if (this.otpTimerSeconds > 0) {
        this.otpTimerSeconds--;
        this.updateTimerDisplay();
      } else {
        this.stopOtpTimer();
      }
    }, 1000);
  }

  stopOtpTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.otpTimerSeconds / 60);
    const secs = this.otpTimerSeconds % 60;
    this.timerDisplay = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
      phone: fullPhone
    };

    this.api.register(registerPayload).subscribe({
      next: (res) => {
        if (res && res.includes('Registration Failed')) {
          this.showAlert(res, 'error');
          this.isLoading = false;
        } else {
          this.showAlert('Registration successful! Check email for OTP (Valid for 5 mins).', 'success');
          this.showOtpForm = true;
          this.isLoading = false;
          this.startOtpTimer();
        }
      },
      error: (err) => {
        this.showAlert('Registration failed: ' + (err.error || 'Server error'), 'error');
        this.isLoading = false;
      }
    });
  }

  onResendOtp() {
    if (this.otpTimerSeconds > 0 || this.isResending) {
      return;
    }

    if (!this.user.email) {
      this.showAlert('Email is missing.', 'error');
      return;
    }

    this.isResending = true;
    this.api.resendOtp(this.user.email).subscribe({
      next: (res) => {
        this.isResending = false;
        this.showAlert('New OTP sent to ' + this.user.email + '! (Valid for 5 mins)', 'success');
        this.otp = '';
        this.startOtpTimer();
      },
      error: (err) => {
        this.isResending = false;
        this.showAlert('Failed to resend OTP: ' + (err.error || 'Server error'), 'error');
      }
    });
  }

  onVerify() {
    if (!this.otp || this.otp.trim().length !== 6) {
      this.showAlert('Please enter the complete 6-digit OTP', 'error');
      return;
    }

    this.isLoading = true;
    this.api.verifyOtp(this.user.email, this.otp.trim()).subscribe({
      next: (res) => {
        if (res && res.includes('Successfully')) {
          this.stopOtpTimer();
          this.showAlert('OTP Verified successfully! Please log in.', 'success');
          this.isLoading = false;
          setTimeout(() => this.router.navigate(['/login']), 1800);
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

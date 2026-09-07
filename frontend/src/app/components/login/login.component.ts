import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnDestroy {
  email = '';
  password = '';
  isLoading = false;
  isResending = false;
  alertMsg = '';
  alertType = 'error';

  showForgotPassword = false;
  forgotEmail = '';
  forgotOtp = '';
  newPassword = '';
  showOtpStage = false;

  otpTimerSeconds = 180;
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

  onLogin() {
    this.isLoading = true;
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (authData) => {
        localStorage.setItem('jwt_token', authData.token);
        localStorage.setItem('user_role', authData.role);
        localStorage.setItem('user_name', authData.name);
        localStorage.setItem('user_email', authData.email);
        if (authData.qrToken) {
          localStorage.setItem('qr_token', authData.qrToken);
        }

        this.showAlert('Login successful!', 'success');

        const role = authData.role ? authData.role.toUpperCase() : '';
        setTimeout(() => {
          if (role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (role === 'RECEPTIONIST') {
            this.router.navigate(['/reception']);
          } else if (role === 'VISITOR') {
            this.router.navigate(['/route-guidance']);
          } else if (role === 'SECURITY') {
            this.router.navigate(['/gate']);
          } else if (role === 'HOST') {
            this.router.navigate(['/host']);
          } else {
            this.router.navigate(['/login']);
          }
        }, 1000);
      },
      error: (err) => {
        this.isLoading = false;
        const msg = err.error || 'Invalid credentials or user not verified';
        this.showAlert(msg, 'error');
      }
    });
  }

  toggleForgot(show: boolean) {
    this.showForgotPassword = show;
    this.showOtpStage = false;
    this.forgotEmail = '';
    this.forgotOtp = '';
    this.newPassword = '';
    this.alertMsg = '';
    this.stopOtpTimer();
  }

  onRequestOtp() {
    if (!this.forgotEmail || !this.forgotEmail.toLowerCase().endsWith('@gmail.com')) {
      this.showAlert('Please enter a valid @gmail.com address', 'error');
      return;
    }

    this.isLoading = true;
    this.api.forgotPassword(this.forgotEmail).subscribe({
      next: (res) => {
        this.showAlert('OTP sent successfully! Check your email.', 'success');
        this.showOtpStage = true;
        this.isLoading = false;
        this.startOtpTimer();
      },
      error: (err) => {
        const errMsg = err.error || 'Failed to send OTP';
        this.showAlert(errMsg, 'error');
        this.isLoading = false;
      }
    });
  }

  onResendForgotOtp() {
    if (this.otpTimerSeconds > 0 || this.isResending) {
      return;
    }

    if (!this.forgotEmail) {
      this.showAlert('Email address is missing', 'error');
      return;
    }

    this.isResending = true;
    this.api.forgotPassword(this.forgotEmail).subscribe({
      next: (res) => {
        this.showAlert('New reset OTP sent to ' + this.forgotEmail + '!', 'success');
        this.forgotOtp = '';
        this.isResending = false;
        this.startOtpTimer();
      },
      error: (err) => {
        const errMsg = err.error || 'Failed to resend OTP';
        this.showAlert(errMsg, 'error');
        this.isResending = false;
      }
    });
  }

  onResetPassword() {
    if (!this.forgotOtp || this.forgotOtp.length !== 6) {
      this.showAlert('OTP must be exactly 6 digits', 'error');
      return;
    }
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(this.newPassword);
    if (this.newPassword.length < 6 || !hasSpecialChar) {
      this.showAlert('Password must be at least 6 characters long and contain at least one special character', 'error');
      return;
    }

    this.isLoading = true;
    this.api.resetPassword(this.forgotEmail, this.forgotOtp, this.newPassword).subscribe({
      next: (res) => {
        this.stopOtpTimer();
        this.showAlert('Password reset successful! Please login with your new password.', 'success');
        this.isLoading = false;
        setTimeout(() => {
          this.toggleForgot(false);
        }, 2000);
      },
      error: (err) => {
        const errMsg = err.error || 'Password reset failed';
        this.showAlert(errMsg, 'error');
        this.isLoading = false;
      }
    });
  }
}

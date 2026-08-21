import { Component } from '@angular/core';
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
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  alertMsg = '';
  alertType = 'error';

  showForgotPassword = false;
  forgotEmail = '';
  forgotOtp = '';
  newPassword = '';
  showOtpStage = false;

  constructor(private api: ApiService, private router: Router) {}

  showAlert(msg: string, type: string) {
    this.alertMsg = msg;
    this.alertType = type;
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
            this.router.navigate(['/access-denied']);
          }
        }, 1500);
      },
      error: (err) => {
        const errMsg = err.error || 'Invalid credentials';
        this.showAlert(errMsg, 'error');
        this.isLoading = false;
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
      },
      error: (err) => {
        const errMsg = err.error || 'Failed to send OTP';
        this.showAlert(errMsg, 'error');
        this.isLoading = false;
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

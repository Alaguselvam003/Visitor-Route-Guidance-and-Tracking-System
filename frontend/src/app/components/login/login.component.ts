import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  alertMsg = '';
  alertType = 'error';

  constructor(private api: ApiService, private router: Router) {}

  showAlert(msg: string, type: string) {
    this.alertMsg = msg;
    this.alertType = type;
  }

  onLogin() {
    this.isLoading = true;
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        try {
          const authData = JSON.parse(res);
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
        } catch (e) {
          this.showAlert('Invalid server response format', 'error');
          this.isLoading = false;
        }
      },
      error: (err) => {
        const errMsg = err.error || 'Invalid credentials';
        this.showAlert(errMsg, 'error');
        this.isLoading = false;
      }
    });
  }
}

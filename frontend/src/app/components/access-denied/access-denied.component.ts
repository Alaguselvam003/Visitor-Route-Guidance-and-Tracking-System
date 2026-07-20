import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container" style="display: flex; justify-content: center; align-items: center; min-height: 80vh;">
      <div class="glass-panel" style="padding: 3rem; text-align: center; width: 100%; max-width: 500px;">
        <h2 style="color: var(--error-color); margin-bottom: 1rem; font-size: 2rem;">Access Denied (403)</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">You do not have the required permissions to access this page.</p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
          <button class="btn btn-primary" (click)="goHome()">My Dashboard</button>
          <button class="btn btn-outline" (click)="logout()">Sign Out</button>
        </div>
      </div>
    </div>
  `
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goHome() {
    const role = localStorage.getItem('user_role');
    const uRole = role ? role.toUpperCase() : '';
    if (uRole === 'ADMIN') {
      this.router.navigate(['/admin']);
    } else if (uRole === 'RECEPTIONIST') {
      this.router.navigate(['/reception']);
    } else if (uRole === 'VISITOR') {
      this.router.navigate(['/route-guidance']);
    } else if (uRole === 'SECURITY') {
      this.router.navigate(['/gate']);
    } else if (uRole === 'HOST') {
      this.router.navigate(['/host']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}

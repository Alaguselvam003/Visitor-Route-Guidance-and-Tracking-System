import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
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

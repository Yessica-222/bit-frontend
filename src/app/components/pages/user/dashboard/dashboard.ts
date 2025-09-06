import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class UserDashboard {
  private router = inject(Router);

  userName = signal('');
  role = signal('');

  constructor() {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName.set(payload.name); // 👈 aquí te llega el nombre desde el JWT
        this.role.set(payload.role);

        if (payload.role !== 'user') {   // o 'user', depende cómo lo configuraste
          this.router.navigate(['/']);
        }
      } catch (error) {
        console.error('Error leyendo el token', error);
        this.router.navigate(['/sign-in']);
      }
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
}

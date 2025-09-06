import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private router = inject(Router);

  userName = signal('');
  role = signal('');

  constructor() {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName.set(payload.name);
        this.role.set(payload.role);

        if (payload.role !== 'admin') {
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
    this.router.navigate(['/sign-in']);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }
  descargarManual() {
    window.open('src/assets/manual.pdf', '_blank');
  }
}

// src/app/components/shared/navbar/navbar.ts
import { Component, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { SigninService } from '../../../services/signin.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  private router = inject(Router);
  public showNavbar: boolean = true;

  constructor(
    public signin: SigninService,
    public cartService: CartService
  ) {
    const user = this.signin.getUser();
    // 🔹 Mostrar navbar solo si NO es administrador
    this.showNavbar = !user || user.role !== 'admin';
  }

  isAdmin(): boolean {
    const user = this.signin.getUser();
    return user?.role === 'admin';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}

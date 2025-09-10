import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from './cart.service';

@Injectable({ providedIn: 'root' })
export class SigninService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private loginUrl = 'http://localhost:5000/api/users/sign-in';

  loginUser(data: { email: string; password: string }) {
    return this.http.post(this.loginUrl, data);
  }

  registerUser(data: { name: string; email: string; password: string; role: string }) {
    return this.http.post('http://localhost:5000/api/users/sign-up', data);
  }

  getUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payloadBase64 = token.split('.')[1];
    const json = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    const decoded = JSON.parse(json);

    if (decoded.user && typeof decoded.user === 'object') return decoded.user;
    if (decoded.role || decoded.email || decoded.name) return decoded;
    if (decoded.sub) return { _id: decoded.sub, ...decoded };

    return decoded;
  } catch (err) {
    console.error('Error decodificando token:', err);
    return null;
  }
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('pendingAction');
    this.router.navigate(['/home']);
  }

  isLogged(): boolean {
    return !!localStorage.getItem('token');
  }

  savePendingAction(action: 'addToCart' | 'agendarServicio', params: any) {
    localStorage.setItem('pendingAction', JSON.stringify({ action, params }));
  }

  executePendingAction(cartService: CartService) {
    const pending = localStorage.getItem('pendingAction');
    if (!pending) return;

    const { action, params } = JSON.parse(pending);

    if (action === 'addToCart' && params.product) {
      cartService.addToCart(params.product); // 👈 ya no usamos .subscribe
    } else if (action === 'agendarServicio' && params.serviceId) {
      alert('✅ Ahora puedes agendar tu servicio');
    }

    localStorage.removeItem('pendingAction');
  }
}

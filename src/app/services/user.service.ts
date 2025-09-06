import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:5000/api/users';

  // ✅ Estado global del usuario (reactivo)
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // ✅ GET /api/users/profile
  getProfile() {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('Cache-Control', 'no-cache')
    .set('Pragma', 'no-cache')
    .set('Expires', '0');

  // 👇 le agregamos un query param dinámico para evitar caché
  return this.http.get(`${this.apiUrl}/profile?ts=${new Date().getTime()}`, { headers });
}

  // ✅ PUT /api/users/profile
  updateProfile(user: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return new Observable(observer => {
      this.http.put(`${this.apiUrl}/profile`, user, { headers }).subscribe({
        next: (updatedUser: any) => {
          this.userSubject.next(updatedUser); // ⬅️ Actualizar inmediatamente
          observer.next(updatedUser);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  // ✅ Obtener usuario actual (sin recargar)
  getCurrentUser() {
    return this.userSubject.value;
  }
}

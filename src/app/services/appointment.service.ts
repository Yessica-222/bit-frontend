import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { User } from '../models/users.model';
import { Service } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private apiUrl = 'http://localhost:5000/api/appointment';

  constructor(private http: HttpClient) {}

  // Método para obtener los headers con token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // 👈 Aquí tienes guardado el JWT tras login
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  createAppointment(data: any): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateAppointment(id: string, data: any): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Si quieres cargar usuarios y servicios desde la API:
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('http://localhost:5000/api/users', {
      headers: this.getAuthHeaders()
    });
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>('http://localhost:5000/api/services', {
      headers: this.getAuthHeaders()
    });
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/my`, {
      headers: this.getAuthHeaders()
    });
  }
}

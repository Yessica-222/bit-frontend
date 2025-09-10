import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Appointment } from '../models/appointment.model';
import { User } from '../models/users.model';
import { Service } from '../models/service.model';
import { environment } from '../../environments/environment'; // ✅ Importa environment

@Injectable({ providedIn: 'root' })
export class AppointmentService {
   private baseApiUrl : string = `${environment.apiUrl}/api/appointment`;

  constructor(private http: HttpClient) {}

  // Método para obtener los headers con token
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // JWT tras login
    return new HttpHeaders({
      Authorization: `Bearer ${token || ''}`
    });
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseApiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  createAppointment(data: any): Observable<Appointment> {
    return this.http.post<Appointment>(this.baseApiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  updateAppointment(id: string, data: any): Observable<Appointment> {
    return this.http.put<Appointment>(`${this.baseApiUrl}/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteAppointment(id: string): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Usuarios y servicios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/api/users`, {
      headers: this.getAuthHeaders()
    });
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(`${environment.apiUrl}/api/services`, {
      headers: this.getAuthHeaders()
    });
  }

  getMyAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.baseApiUrl}/my`, {
      headers: this.getAuthHeaders()
    });
  }
}

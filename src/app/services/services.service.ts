import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Service } from '../models/service.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private baseApiUrl: string = `${environment.apiUrl}/api/services`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(this.baseApiUrl, this.getAuthHeaders());
  }

  createService(data: Service): Observable<Service> {
    return this.http.post<Service>(this.baseApiUrl, data, this.getAuthHeaders());
  }

  updateService(id: string, data: Partial<Service>): Observable<Service> {
    return this.http.put<Service>(`${this.baseApiUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete(`${this.baseApiUrl}/${id}`, this.getAuthHeaders());
  }
}

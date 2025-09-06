import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Service {
  _id?: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private baseUrl = 'http://localhost:5000/api/services';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getServices() {
    return this.http.get<Service[]>(this.baseUrl);
  }

  createService(data: Service) {
    return this.http.post<Service>(this.baseUrl, data, this.getAuthHeaders());
  }

  updateService(id: string, data: Partial<Service>) {
    return this.http.put<Service>(`${this.baseUrl}/${id}`, data, this.getAuthHeaders());
  }

  deleteService(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getAuthHeaders());
  }

  
}

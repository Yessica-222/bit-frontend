// invoices.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private baseUrl = 'http://localhost:5000/api/invoices';

  constructor(private http: HttpClient) {}

  private get authHeaders() {
    const token = localStorage.getItem('token') || '';
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  // ADMIN: obtiene todas las facturas
  getInvoices(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl, this.authHeaders);
  }

  // USER: obtiene solo las facturas del usuario autenticado
  getMyInvoices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/mine`, this.authHeaders);
  }

  // ADMIN: crea una factura global
  createInvoice(payload: {
    userId: string;
    products: { productId: string; quantity: number }[];
    total: number;
    paymentMethod: string;
    status?: string;
  }): Observable<any> {
    return this.http.post(this.baseUrl, payload, this.authHeaders);
  }

  // USER: crea una factura propia
  createUserInvoice(payload: {
    products: { productId: string; quantity: number }[];
    total: number;
    paymentMethod: string;
    status?: string;
  }): Observable<any> {
    return this.http.post(`${this.baseUrl}/mine`, payload, this.authHeaders);
  }

  // ADMIN: actualizar factura
  updateInvoice(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.authHeaders);
  }

  // ADMIN: eliminar factura
  deleteInvoice(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.authHeaders);
  }
}

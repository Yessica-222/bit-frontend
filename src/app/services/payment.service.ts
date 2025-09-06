import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:5000/api/payments'; // Ajusta si tu backend corre en otro puerto

  constructor(private http: HttpClient) {}

  createPayment(paymentData: any): Observable<any> {
    return this.http.post(this.apiUrl, paymentData);
  }

  getAllPayments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getPaymentById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  updatePayment(id: string, paymentData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, paymentData);
  }

  deletePayment(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

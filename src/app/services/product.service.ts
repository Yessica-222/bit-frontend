import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/api/products`; // endpoint de tu backend

  constructor(private http: HttpClient) {}

  get authHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }

  // Aquí los nombres son como el componente los llama
  getProducts() {
  return this.http.get<any[]>(this.baseUrl, this.authHeaders);
}

  createProduct(data: any) {
    return this.http.post(this.baseUrl, data, this.authHeaders);
  }

  updateProduct(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.authHeaders);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`, this.authHeaders);
  }
}

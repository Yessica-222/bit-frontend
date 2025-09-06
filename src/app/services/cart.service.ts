import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: any[] = [];
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/invoices/mine'; // Ajusta según tu backend

  // 🔑 Resolver un identificador estable para el producto
  private resolveId(p: any): string | number {
    return (
      p?.id ??
      p?._id ??
      p?.productId ??
      p?.codigo ??
      p?.code ??
      p?.sku ??
      p?.nombre_servicio ??
      p?.name ??
      ''
    );
  }

  // ➕ Agregar producto al carrito (con validación de stock)
  addToCart(product: any): string | true {
    const pid = this.resolveId(product);

    const normalized = {
      id: pid,
      name: product?.name ?? product?.nombre_servicio ?? 'Producto',
      description: product?.description ?? product?.descripcion ?? '',
      price: Number(product?.price ?? product?.precio ?? 0),
      image: product?.image ?? product?.imagen ?? 'assets/placeholder.png',
      quantity: 1,
      stock: product.stock ?? Infinity,
      raw: product
    };

    const existing = this.cartItems.find(it => it.id === pid);

    if (existing) {
      if (existing.quantity + 1 > normalized.stock) {
        return `⚠️ Solo hay ${normalized.stock} unidades disponibles de ${normalized.name}`;
      }
      existing.quantity += 1;
    } else {
      if (normalized.quantity > normalized.stock) {
        return `⚠️ Solo hay ${normalized.stock} unidades disponibles de ${normalized.name}`;
      }
      this.cartItems.push(normalized);
    }

    return true;
  }

  // ➖ Disminuir cantidad (o eliminar si llega a 1)
  decrease(item: any) {
    if (item?.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeFromCart(item);
    }
  }

  // ⬆️ Aumentar cantidad (validando stock)
  increase(item: any): string | true {
    if (item.quantity + 1 > item.stock) {
      return `⚠️ Solo hay ${item.stock} unidades disponibles de ${item.name}`;
    }
    item.quantity += 1;
    return true;
  }

  // 🗑️ Quitar producto
  removeFromCart(productOrId: any) {
    if (typeof productOrId === 'object') {
      this.cartItems = this.cartItems.filter(it => it !== productOrId);
    } else {
      this.cartItems = this.cartItems.filter(it => it.id !== productOrId);
    }
  }

  // 🧹 Vaciar carrito
  clearCart() {
    this.cartItems = [];
  }

  // 📦 Obtener items del carrito
  getCartItems() {
    return this.cartItems;
  }

  // 🔢 Cantidad total
  getCartCount(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  // 💵 Total
  getTotal(): number {
    return this.cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  }

  // 💳 Crear factura en backend
  createInvoiceBackend(products: any[], total: number): Observable<any> {
    return this.http.post(this.apiUrl, { products, total }).pipe(
      catchError(err => of(err.error)) // capturamos errores como observable
    );
  }
}

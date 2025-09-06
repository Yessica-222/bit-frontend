import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { SigninService } from '../../../services/signin.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products {
  products: any[] = [];
  showModal = false;
  modalMessage = '';

  private productService = inject(ProductService);
  private signinService = inject(SigninService);
  private cartService = inject(CartService);

  constructor() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error al cargar productos', err),
    });
  }

  addToCart(product: any) {
    const result = this.cartService.addToCart(product);

    if (typeof result === 'string') {
      this.modalMessage = result;
    } else {
      this.modalMessage = `✅ ${product.name || product.nombre_servicio} agregado al carrito`;
    }

    this.showModal = true;
    setTimeout(() => this.showModal = false, 2000);
  }

  checkout() {
    if (!this.signinService.isLogged()) {
      this.modalMessage = '⚠️ Debes iniciar sesión para comprar';
      this.showModal = true;
      setTimeout(() => this.showModal = false, 3000);
      return;
    }

    this.cartService.createInvoiceBackend(
      this.cartService.getCartItems(),
      this.cartService.getTotal()
    ).subscribe((res: any) => {
      if (res?.message) {
        this.modalMessage = `❌ ${res.message}`;
      } else {
        this.modalMessage = '✅ Compra realizada con éxito';
        this.cartService.clearCart();
      }
      this.showModal = true;
      setTimeout(() => this.showModal = false, 3000);
    });
  }
}

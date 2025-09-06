import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class CartComponent {
  showModal = false;
  modalMessage = '';
  cartService = inject(CartService);
  router = inject(Router);

  // Lista reactiva desde el servicio
  get items() {
    return this.cartService.getCartItems();
  }

  addToCart(product: any) {
    const result = this.cartService.addToCart(product);

    if (typeof result === 'string') {
      this.modalMessage = result; // mensaje de error de stock
    } else {
      this.modalMessage = `✅ ${product.name || product.nombre_servicio} agregado al carrito`;
    }

    this.showModal = true;
    setTimeout(() => this.showModal = false, 2000);
  }

  increase(item: any) {
    const result = this.cartService.increase(item);
    if (typeof result === 'string') {
      this.modalMessage = result;
      this.showModal = true;
      setTimeout(() => this.showModal = false, 2000);
    }
  }

  decrease(item: any) {
    this.cartService.decrease(item);
  }

  removeItem(item: any) {
    this.cartService.removeFromCart(item);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  get total() {
    return this.cartService.getTotal();
  }

  goToPayment() {
    this.router.navigate(['/payments'], {
      state: {
        products: this.items,
        total: this.total
      }
    });
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class HomeComponent {
  products: any[] = [];
  isLogged = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {
    this.loadProducts();
    this.checkLogin();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data: any) => (this.products = data),
      error: () => alert('❌ Error al cargar productos'),
    });
  }

  checkLogin() {
    this.isLogged = !!localStorage.getItem('token');
  }

  addToCart(product: any) {
    if (!this.isLogged) {
      alert('⚠ Debes iniciar sesión para agregar al carrito');
      this.router.navigate(['/sign-in']);
      return;
    }

    this.cartService.addToCart(product); // 👈 ya no usamos .subscribe
  }
}

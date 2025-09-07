import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { CartService } from '../../../services/cart.service';
import { InvoiceService } from '../../../services/invoices.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.html',
  styleUrls: ['./payment.css']
})
export class Payment {
  private cartService = inject(CartService);
  private invoiceService = inject(InvoiceService);
  private router = inject(Router);

  cartItems: any[] = [];
  total = 0;
  selectedMethod = '';

  showToast = false;
  toastMessage = '';
  showLoginModal = false;
  showSuccessModal = false;
  creating = false;

  paymentMethods = [
    { name: 'Efecty',        label: '5462785',      logo: 'pagos/efecty.png' },
    { name: 'Nequi',       label: '3138805695',         logo: 'pagos/nequi.png' },
    { name: 'Daviplata',      label: '3138805695',        logo: 'pagos/daviplata.png' },
    { name: 'Bancolombia', label: '9175638996',   logo: 'pagos/bancolombia.jpg' },
  ];

  constructor() {
    this.cartItems = this.cartService.getCartItems();
    this.total = this.cartService.getTotal();
  }

  seleccionarMetodo(method: string) {
    this.selectedMethod = method;
    this.toastMessage = `✅ Seleccionaste ${method}`;
    this.showToast = true;
    setTimeout(() => (this.showToast = false), 1800);
  }

  confirmarPago() {
    if (!this.selectedMethod) {
      this.toastMessage = '⚠️ Selecciona un método de pago';
      this.showToast = true;
      setTimeout(() => (this.showToast = false), 1800);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.showLoginModal = true;
      return;
    }

    const products = (this.cartItems || []).map((it) => ({
      productId: it?.id ?? it?._id ?? it?.productId ?? it?.raw?._id,
      quantity: Number(it?.quantity || 1),
    }));

    this.creating = true;
    this.invoiceService
      .createUserInvoice({
        products,
        total: this.total,
        paymentMethod: this.selectedMethod,
        status: 'pending'
      })
      .subscribe({
        next: () => {
          this.creating = false;
          this.cartService.clearCart();
          this.showSuccessModal = true;
        },
        error: (err) => {
          this.creating = false;
          console.error('Error creando factura:', err);
          this.toastMessage = '❌ Error al generar la factura';
          this.showToast = true;
          setTimeout(() => (this.showToast = false), 2200);
        },
      });
  }

  goToLogin() {
    localStorage.setItem('postLoginRedirect', '/payments');
    this.router.navigate(['/sign-in']);
  }

  goToInvoices() {
    this.showSuccessModal = false;
    this.router.navigate(['/user/invoices']);
  }
}

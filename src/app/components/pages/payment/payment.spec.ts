import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Payment } from './payment';
import { CartService } from '../../../services/cart.service';
import { InvoiceService } from '../../../services/invoices.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('Payment Component', () => {
  let component: Payment;
  let cartService: jasmine.SpyObj<CartService>;
  let invoiceService: jasmine.SpyObj<InvoiceService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    cartService = jasmine.createSpyObj('CartService', ['getCartItems', 'getTotal', 'clearCart']);
    invoiceService = jasmine.createSpyObj('InvoiceService', ['createUserInvoice']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    cartService.getCartItems.and.returnValue([
      { _id: '1', name: 'Producto 1', quantity: 2, price: 10 }
    ]);
    cartService.getTotal.and.returnValue(20);

    TestBed.configureTestingModule({
      providers: [
        { provide: CartService, useValue: cartService },
        { provide: InvoiceService, useValue: invoiceService },
        { provide: Router, useValue: router }
      ]
    });

    component = TestBed.runInInjectionContext(() => new Payment());
  });

  it('should initialize cartItems and total', () => {
    expect(component.cartItems.length).toBe(1);
    expect(component.total).toBe(20);
  });

  it('should select a payment method and show toast', fakeAsync(() => {
    component.seleccionarMetodo('Nequi');
    expect(component.selectedMethod).toBe('Nequi');
    expect(component.toastMessage).toBe('✅ Seleccionaste Nequi');
    expect(component.showToast).toBeTrue();

    tick(1800);
    expect(component.showToast).toBeFalse();
  }));

  it('should show warning if no payment method selected on confirm', fakeAsync(() => {
    component.selectedMethod = '';
    component.confirmarPago();
    expect(component.toastMessage).toBe('⚠️ Selecciona un método de pago');
    expect(component.showToast).toBeTrue();

    tick(1800);
    expect(component.showToast).toBeFalse();
  }));

  it('should show login modal if user not logged in', () => {
    localStorage.removeItem('token');
    component.selectedMethod = 'Nequi';
    component.confirmarPago();
    expect(component.showLoginModal).toBeTrue();
  });

  it('should create invoice successfully', fakeAsync(() => {
    localStorage.setItem('token', '123');
    component.selectedMethod = 'Nequi';
    invoiceService.createUserInvoice.and.returnValue(of({}));

    component.confirmarPago();
    tick();

    expect(component.creating).toBeFalse();
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(component.showSuccessModal).toBeTrue();
  }));

  it('should handle error when invoice creation fails', fakeAsync(() => {
    localStorage.setItem('token', '123');
    component.selectedMethod = 'Nequi';
    invoiceService.createUserInvoice.and.returnValue(throwError(() => new Error('Error prueba')));

    const consoleSpy = spyOn(console, 'error');
    component.confirmarPago();
    tick();

    expect(component.creating).toBeFalse();
    expect(consoleSpy).toHaveBeenCalledWith('Error creando factura:', jasmine.any(Error));
    expect(component.toastMessage).toBe('❌ Error al generar la factura');
    expect(component.showToast).toBeTrue();

    tick(2200);
    expect(component.showToast).toBeFalse();
  }));

  it('should navigate to login when goToLogin is called', () => {
    component.goToLogin();
    expect(localStorage.getItem('postLoginRedirect')).toBe('/payments');
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
  });

  it('should navigate to invoices when goToInvoices is called', () => {
    component.showSuccessModal = true;
    component.goToInvoices();
    expect(component.showSuccessModal).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/user/invoices']);
  });
});

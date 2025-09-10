import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Products } from './products';
import { ProductService } from '../../../services/product.service';
import { SigninService } from '../../../services/signin.service';
import { CartService } from '../../../services/cart.service';
import { of, throwError } from 'rxjs';

describe('Products Component', () => {
  let component: Products;
  let productService: jasmine.SpyObj<ProductService>;
  let signinService: jasmine.SpyObj<SigninService>;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(() => {
    productService = jasmine.createSpyObj('ProductService', ['getProducts']);
    signinService = jasmine.createSpyObj('SigninService', ['isLogged']);
    cartService = jasmine.createSpyObj('CartService', ['addToCart', 'createInvoiceBackend', 'getCartItems', 'getTotal', 'clearCart']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: SigninService, useValue: signinService },
        { provide: CartService, useValue: cartService }
      ]
    });

    // Mock inicial de getProducts
    productService.getProducts.and.returnValue(of([
      { _id: '1', name: 'Producto 1', price: 10 },
      { _id: '2', name: 'Producto 2', price: 20 }
    ]));

    component = TestBed.runInInjectionContext(() => new Products());
  });

  it('should load products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(2);
    expect(component.products[0].name).toBe('Producto 1');
  });

  it('should handle error when loading products fails', fakeAsync(() => {
    const consoleSpy = spyOn(console, 'error');
    productService.getProducts.and.returnValue(throwError(() => new Error('Error de prueba')));
    component = TestBed.runInInjectionContext(() => new Products());
    tick();
    expect(consoleSpy).toHaveBeenCalledWith('Error al cargar productos', jasmine.any(Error));
  }));

  it('should show correct modal message when adding to cart', () => {
    const product = { name: 'Producto 1' };

    // Caso de éxito
    cartService.addToCart.and.returnValue(true);
    component.addToCart(product);
    expect(component.modalMessage).toBe('✅ Producto 1 agregado al carrito');
    expect(component.showModal).toBeTrue();

    // Caso de error string
    cartService.addToCart.and.returnValue('Stock insuficiente');
    component.addToCart(product);
    expect(component.modalMessage).toBe('Stock insuficiente');
    expect(component.showModal).toBeTrue();
  });

  it('should show warning if user not logged in on checkout', fakeAsync(() => {
    signinService.isLogged.and.returnValue(false);
    component.checkout();
    tick();
    expect(component.modalMessage).toBe('⚠️ Debes iniciar sesión para comprar');
    expect(component.showModal).toBeTrue();
  }));

  it('should complete checkout successfully', fakeAsync(() => {
    signinService.isLogged.and.returnValue(true);
    cartService.getCartItems.and.returnValue([{ _id: '1', name: 'Producto 1', price: 10 }]);
    cartService.getTotal.and.returnValue(10);
    cartService.createInvoiceBackend.and.returnValue(of({}));

    component.checkout();
    tick();

    expect(component.modalMessage).toBe('✅ Compra realizada con éxito');
    expect(cartService.clearCart).toHaveBeenCalled();
    expect(component.showModal).toBeTrue();
  }));

  it('should show error message if checkout fails', fakeAsync(() => {
    signinService.isLogged.and.returnValue(true);
    cartService.getCartItems.and.returnValue([{ _id: '1', name: 'Producto 1', price: 10 }]);
    cartService.getTotal.and.returnValue(10);
    cartService.createInvoiceBackend.and.returnValue(of({ message: 'Saldo insuficiente' }));

    component.checkout();
    tick();

    expect(component.modalMessage).toBe('❌ Saldo insuficiente');
    expect(component.showModal).toBeTrue();
  }));
});

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home';
import { ProductService } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    productService = jasmine.createSpyObj('ProductService', ['getProducts']);
    cartService = jasmine.createSpyObj('CartService', ['addToCart']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: productService },
        { provide: CartService, useValue: cartService },
        { provide: Router, useValue: router }
      ]
    });

    spyOn(window, 'alert'); // Espiar los alertas

    // Mock de getProducts por defecto
    productService.getProducts.and.returnValue(of([
      { _id: '1', name: 'Producto 1', price: 10 },
      { _id: '2', name: 'Producto 2', price: 20 }
    ]));

    component = TestBed.runInInjectionContext(() => new HomeComponent(
      productService,
      cartService,
      router
    ));
  });

  it('should load products on initialization', () => {
    expect(component.products.length).toBe(2);
    expect(component.products[0].name).toBe('Producto 1');
  });

  it('should handle error when loading products', fakeAsync(() => {
    productService.getProducts.and.returnValue(throwError(() => new Error('Error prueba')));
    
    // Forzar recarga
    component.loadProducts();
    tick();

    expect(window.alert).toHaveBeenCalledWith('❌ Error al cargar productos');
  }));

  it('should check login status', () => {
    localStorage.setItem('token', '123');
    component.checkLogin();
    expect(component.isLogged).toBeTrue();

    localStorage.removeItem('token');
    component.checkLogin();
    expect(component.isLogged).toBeFalse();
  });

  it('should add to cart if user is logged in', () => {
    localStorage.setItem('token', '123');
    component.isLogged = true;

    const product = { _id: '1', name: 'Producto 1' };
    component.addToCart(product);

    expect(cartService.addToCart).toHaveBeenCalledWith(product);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should alert and redirect if user is not logged in', () => {
    localStorage.removeItem('token');
    component.isLogged = false;

    const product = { _id: '1', name: 'Producto 1' };
    component.addToCart(product);

    expect(cartService.addToCart).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('⚠ Debes iniciar sesión para agregar al carrito');
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
  });
});

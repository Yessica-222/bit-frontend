import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartComponent } from '../cart/cart';
import { CartService } from '../../../../services/cart.service';
import { Router } from '@angular/router';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let router: jasmine.SpyObj<Router>;

  const mockProduct = { _id: '1', name: 'Producto Test', price: 100, stock: 5 };

  beforeEach(async () => {
    const cartSpy = jasmine.createSpyObj('CartService', [
      'getCartItems', 'addToCart', 'increase', 'decrease', 'removeFromCart', 'clearCart', 'getTotal'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: CartService, useValue: cartSpy },
        { provide: Router, useValue: routerSpy },
      ]
    }).compileComponents();

    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    cartService.getCartItems.and.returnValue([mockProduct]);
    cartService.getTotal.and.returnValue(100);

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should get items from cartService', () => {
    expect(component.items).toEqual([mockProduct]);
  });

  it('should add product to cart successfully', fakeAsync(() => {
    cartService.addToCart.and.returnValue(true); // ✅ usar true
    component.addToCart(mockProduct);

    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct);
    expect(component.modalMessage).toBe(`✅ ${mockProduct.name} agregado al carrito`);
    tick(2000);
    expect(component.showModal).toBeFalse();
  }));

  it('should show error when adding product fails', fakeAsync(() => {
    cartService.addToCart.and.returnValue('Stock insuficiente');
    component.addToCart(mockProduct);

    expect(component.modalMessage).toBe('Stock insuficiente');
    expect(component.showModal).toBeTrue();
    tick(2000);
    expect(component.showModal).toBeFalse();
  }));

  it('should increase item quantity successfully', fakeAsync(() => {
    cartService.increase.and.returnValue(true); // ✅ usar true
    component.increase(mockProduct);

    expect(cartService.increase).toHaveBeenCalledWith(mockProduct);
  }));

  it('should show error when increasing item fails', fakeAsync(() => {
    cartService.increase.and.returnValue('Stock insuficiente');
    component.increase(mockProduct);

    expect(component.modalMessage).toBe('Stock insuficiente');
    expect(component.showModal).toBeTrue();
    tick(2000);
    expect(component.showModal).toBeFalse();
  }));

  it('should decrease item quantity', () => {
    component.decrease(mockProduct);
    expect(cartService.decrease).toHaveBeenCalledWith(mockProduct);
  });

  it('should remove item from cart', () => {
    component.removeItem(mockProduct);
    expect(cartService.removeFromCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should clear the cart', () => {
    component.clearCart();
    expect(cartService.clearCart).toHaveBeenCalled();
  });

  it('should get total from cartService', () => {
    expect(component.total).toBe(100);
  });

  it('should navigate to payment page with state', () => {
    component.goToPayment();
    expect(router.navigate).toHaveBeenCalledWith(['/payments'], {
      state: { products: [mockProduct], total: 100 }
    });
  });
});

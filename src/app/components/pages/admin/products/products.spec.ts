import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from '../products/products';
import { ProductService } from '../../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let toast: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  const mockProduct = {
    _id: '1',
    name: 'Producto Test',
    description: 'Desc',
    price: 100,
    stock: 10,
    category: 'Cat',
    image: ''
  };

  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductService', [
      'getProducts', 'createProduct', 'updateProduct', 'deleteProduct'
    ]);
    const toastSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productSpy },
        { provide: ToastrService, useValue: toastSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    toast = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    productService.getProducts.and.returnValue(of([mockProduct]));

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load products on init', () => {
    expect(component.products()).toEqual([mockProduct]);
  });

  // -----------------------------
  // Test directo de createProduct
  // -----------------------------
  it('should call productService.createProduct directly', () => {
    const data = {
      name: 'Directo',
      description: 'Desc',
      price: 50,
      stock: 3,
      category: 'Cat',
      image: ''
    };
    productService.createProduct.and.returnValue(of({}));

    component.createProduct(data);

    expect(productService.createProduct).toHaveBeenCalledWith(data);
  });

  // -----------------------------
  // Test directo de updateProduct
  // -----------------------------
  it('should call productService.updateProduct directly', () => {
    component.selectedProductId = '1';
    const data = {
      name: 'Actualizado',
      description: 'Desc',
      price: 120,
      stock: 8,
      category: 'Cat',
      image: ''
    };
    productService.updateProduct.and.returnValue(of({}));

    component.updateProduct(data);

    expect(productService.updateProduct).toHaveBeenCalledWith('1', data);
    expect(component.selectedProductId).toBeNull();
  });

  // -----------------------------
  // ConfirmAction - update cuando hay selectedProductId
  // -----------------------------
  it('should call updateProduct when selectedProductId is set in confirmAction', () => {
    component.pendingAction = 'update';
    component.selectedProductId = '1';
    component.productForm.setValue({
      name: 'Actualizar',
      description: 'Desc',
      price: 100,
      stock: 5,
      category: 'Cat',
      image: ''
    });

    productService.updateProduct.and.returnValue(of({}));
    component.confirmAction();

    expect(productService.updateProduct).toHaveBeenCalledWith('1', {
      name: 'Actualizar',
      description: 'Desc',
      price: 100,
      stock: 5,
      category: 'Cat',
      image: ''
    });
    expect(toast.success).toHaveBeenCalledWith('Producto actualizado');
  });

  // -----------------------------
  // ConfirmAction - create cuando NO hay selectedProductId
  // -----------------------------
  it('should call createProduct when no selectedProductId in confirmAction', () => {
    component.pendingAction = 'update';
    component.selectedProductId = null;
    component.productForm.setValue({
      name: 'Nuevo',
      description: 'Desc',
      price: 100,
      stock: 5,
      category: 'Cat',
      image: ''
    });

    productService.createProduct.and.returnValue(of({}));
    component.confirmAction();

    expect(productService.createProduct).toHaveBeenCalledWith({
      name: 'Nuevo',
      description: 'Desc',
      price: 100,
      stock: 5,
      category: 'Cat',
      image: ''
    });
    expect(toast.success).toHaveBeenCalledWith('Producto creado');
  });

  // -----------------------------
  // ConfirmAction - delete
  // -----------------------------
  it('should call deleteProduct in confirmAction', () => {
    component.pendingAction = 'delete';
    component.selectedProductId = '1';
    productService.deleteProduct.and.returnValue(of({}));

    component.confirmAction();

    expect(productService.deleteProduct).toHaveBeenCalledWith('1');
    expect(toast.success).toHaveBeenCalledWith('Producto eliminado');
  });

  // -----------------------------
  // SubmitForm sets pendingAction
  // -----------------------------
  it('should set pendingAction and showConfirmDialog on submitForm', () => {
    component.submitForm();
    expect(component.pendingAction).toBe('update');
    expect(component.showConfirmDialog).toBeTrue();
  });

  // -----------------------------
  // DeleteProduct sets pendingAction
  // -----------------------------
  it('should set pendingAction and showConfirmDialog on deleteProduct', () => {
    component.deleteProduct('1');
    expect(component.selectedProductId).toBe('1');
    expect(component.pendingAction).toBe('delete');
    expect(component.showConfirmDialog).toBeTrue();
  });

  // -----------------------------
  // ResetForm
  // -----------------------------
  it('should reset form and selectedProductId on resetForm', () => {
    component.selectedProductId = '1';
    component.productForm.setValue({
      name: 'Test',
      description: 'Desc',
      price: 50,
      stock: 2,
      category: 'Cat',
      image: 'img.png'
    });

    component.resetForm();

    expect(component.selectedProductId).toBeNull();
    expect(component.productForm.value).toEqual({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
      image: ''
    });
  });

  // -----------------------------
  // EditProduct sets form
  // -----------------------------
  it('should edit product and set form values on editProduct', () => {
    component.editProduct(mockProduct);
    expect(component.selectedProductId).toBe('1');
    expect(component.productForm.value).toEqual({
      name: 'Producto Test',
      description: 'Desc',
      price: 100,
      stock: 10,
      category: 'Cat',
      image: ''
    });
  });

  // -----------------------------
  // Volver al dashboard
  // -----------------------------
  it('should navigate to dashboard on volverInicio', () => {
    component.volverInicio();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should update form image when file is selected', (done) => {
  const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
  const event = { target: { files: [file] } } as unknown as Event;

  // Mock FileReader
  class MockFileReader {
    result: any = null;
    onload: ((ev: any) => any) | null = null;

    readAsDataURL(file: Blob) {
      this.result = 'data:image/png;base64,dummy';
      if (this.onload) {
        this.onload({ target: this } as unknown); // 'unknown' evita el error de TS
      }
    }
  }

  // Reemplazamos FileReader globalmente
  (window as any).FileReader = MockFileReader;

  component.onFileSelected(event);

  setTimeout(() => {
    expect(component.productForm.value.image).toBe('data:image/png;base64,dummy');
    done();
  }, 0);
});

});

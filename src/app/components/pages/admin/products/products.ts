import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../services/product.service';

interface products {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image?: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class ProductComponent {
  message: string = '';
  private productService = inject(ProductService);
  private toast = inject(ToastrService);
  private router = inject(Router);

  products = signal<products[]>([]);
  selectedProductId: string | null = null;
  pendingAction: 'delete' | 'update' | null = null;
  showConfirmDialog = false;

  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    stock: new FormControl(0, Validators.required),
    category: new FormControl('', Validators.required),
    image: new FormControl('')
  });

  constructor() {
  this.loadProducts();
}

loadProducts() {
  this.productService.getProducts().subscribe({
    next: (res: any) => {
      this.products.set(res);
      console.log('Productos cargados:', res); // 👈 para debug
    },
    error: () => this.toast.error('Error cargando productos'),
  });
}


  // Crear factura
  createProduct(data: any) {
    this.productService.createProduct(data).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (err) => {
        console.error('Error creando factura:', err);
      },
    });
  }

  // Actualizar factura
  updateProduct(data: any) {
    if (!this.selectedProductId) return;

    this.productService.updateProduct(this.selectedProductId, data).subscribe({
      next: () => {
        this.loadProducts();
        this.selectedProductId = null;
      },
      error: (err) => {
        console.error('Error actualizando factura:', err);
      },
    });
  }

  // Eliminar factura
  deleteProduct(id: string) {
    this.selectedProductId = id;
    this.pendingAction = 'delete';
    this.showConfirmDialog = true;
  }


  submitForm() {
    this.pendingAction = 'update';
    this.showConfirmDialog = true;
  }

  confirmAction() {
    const data = this.productForm.value;

    if (this.pendingAction === 'update') {
      if (this.selectedProductId) {
        this.productService.updateProduct(this.selectedProductId, data).subscribe({
          next: () => {
            this.toast.success('Producto actualizado');
            this.loadProducts();
            this.resetForm();
          },
          error: () => this.toast.error('Error actualizando producto')
        });
      } else {
        this.productService.createProduct(data).subscribe({
          next: () => {
            this.toast.success('Producto creado');
            this.loadProducts();
            this.resetForm();
          },
          error: () => this.toast.error('Error creando producto')
        });
      }
    }

    if (this.pendingAction === 'delete' && this.selectedProductId) {
      this.productService.deleteProduct(this.selectedProductId).subscribe({
        next: () => {
          this.toast.success('Producto eliminado');
          this.loadProducts();
        },
        error: () => this.toast.error('Error eliminando producto')
      });
    }

    this.cancelAction();
  }

  cancelAction() {
    this.showConfirmDialog = false;
    this.pendingAction = null;
    this.selectedProductId = null;
  }

  editProduct(product: products) {
    this.productForm.setValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      image: product.image || ''
    });
    this.selectedProductId = product._id!;
  }

  resetForm() {
    this.productForm.reset();
    this.selectedProductId = null;
  }

  volverInicio(): void {
    this.router.navigate(['/dashboard']);
  }

  onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    // Guardamos la imagen en Base64 dentro del FormControl 'image'
    this.productForm.patchValue({ image: reader.result as string });
  };
  reader.readAsDataURL(file);
}

}

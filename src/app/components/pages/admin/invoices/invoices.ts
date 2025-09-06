// invoices.ts (Admin invoices component)
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InvoiceService } from '../../../../services/invoices.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css'],
})
export class Invoices {
  private invoiceService = inject(InvoiceService);
  private toast = inject(ToastrService);
  private router = inject(Router);
  private http = inject(HttpClient);

  invoices: any[] = [];
  users: any[] = [];
  products: any[] = [];

  selectedInvoiceId: string | null = null;
  pendingAction: 'delete' | 'update' | 'create' | null = null;
  showConfirmDialog = false;

  invoiceForm = new FormGroup({
    userId: new FormControl<string | null>(null, Validators.required),
    total: new FormControl<number>(0, Validators.required),
    paymentMethod: new FormControl<string>('cash', Validators.required),
    status: new FormControl<string>('pending'),
    products: new FormArray([
      new FormGroup({
        productId: new FormControl<string | null>(null, Validators.required),
        quantity: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      }),
    ]),
  });

  constructor() {
    this.loadInvoices();
    this.loadUsers();
    this.loadProducts();
  }

  // --- Cargas ---
  loadUsers() {
    this.http.get<any[]>('http://localhost:5000/api/users').subscribe({
      next: (res) => (this.users = res || []),
      error: (err) => {
        console.error('loadUsers error', err);
        this.toast.error('Error cargando usuarios');
      },
    });
  }

  loadProducts() {
    this.http.get<any[]>('http://localhost:5000/api/products').subscribe({
      next: (res) => (this.products = res || []),
      error: (err) => {
        console.error('loadProducts error', err);
        this.toast.error('Error cargando productos');
      },
    });
  }

  loadInvoices() {
    this.invoiceService.getInvoices().subscribe({
      next: (res: any) => {
        this.invoices = res || [];
      },
      error: (err) => {
        console.error('loadInvoices error', err);
        this.toast.error('Error cargando facturas');
      },
    });
  }

  // --- FormArray helpers ---
  get productsArray() {
    return this.invoiceForm.get('products') as FormArray;
  }

  addProduct() {
    this.productsArray.push(
      new FormGroup({
        productId: new FormControl<string | null>(null, Validators.required),
        quantity: new FormControl<number>(1, [Validators.required, Validators.min(1)]),
      })
    );
  }

  removeProduct(index: number) {
    this.productsArray.removeAt(index);
  }

  // --- CRUD admin ---
  submitForm() {
    this.pendingAction = this.selectedInvoiceId ? 'update' : 'create';
    this.showConfirmDialog = true;
  }

  confirmAction() {
    // asegurar que userId no sea null/undefined
    const userId = this.invoiceForm.value.userId ?? '';
    if (!userId) {
      this.toast.error('Debe seleccionar un usuario');
      return;
    }

    const data: {
      userId: string;
      total: number;
      paymentMethod: string;
      status?: string;
      products: { productId: string; quantity: number }[];
    } = {
      userId,
      total: Number(this.invoiceForm.value.total ?? 0),
      paymentMethod: this.invoiceForm.value.paymentMethod ?? 'cash',
      status: this.invoiceForm.value.status ?? 'pending',
      products: (this.invoiceForm.value.products || []).map((p: any) => ({
        productId: p.productId,
        quantity: Number(p.quantity),
      })),
    };

    if (this.pendingAction === 'create') {
      this.invoiceService.createInvoice(data).subscribe({
        next: () => {
          this.toast.success('Invoice created');
          this.loadInvoices();
          this.resetForm();
        },
        error: (err) => {
          console.error('createInvoice error', err);
          this.toast.error('Error creating invoice');
        },
      });
    } else if (this.pendingAction === 'update' && this.selectedInvoiceId) {
      this.invoiceService.updateInvoice(this.selectedInvoiceId, data).subscribe({
        next: () => {
          this.toast.success('Invoice updated');
          this.loadInvoices();
          this.resetForm();
        },
        error: (err) => {
          console.error('updateInvoice error', err);
          this.toast.error('Error updating invoice');
        },
      });
    } else if (this.pendingAction === 'delete' && this.selectedInvoiceId) {
      this.invoiceService.deleteInvoice(this.selectedInvoiceId).subscribe({
        next: () => {
          this.toast.success('Invoice deleted');
          this.loadInvoices();
        },
        error: (err) => {
          console.error('deleteInvoice error', err);
          this.toast.error('Error deleting invoice');
        },
      });
    }

    this.cancelAction();
  }

  cancelAction() {
    this.showConfirmDialog = false;
    this.pendingAction = null;
    this.selectedInvoiceId = null;
  }

  editInvoice(invoice: any) {
    this.invoiceForm.patchValue({
      userId: typeof invoice.userId === 'string' ? invoice.userId : invoice.userId?._id,
      total: invoice.total,
      paymentMethod: invoice.paymentMethod || 'cash',
      status: invoice.status || 'pending',
    });

    this.productsArray.clear();
    (invoice.products || []).forEach((p: any) => {
      this.productsArray.push(
        new FormGroup({
          productId: new FormControl(
            typeof p.productId === 'string' ? p.productId : p.productId?._id || '',
            Validators.required
          ),
          quantity: new FormControl(p.quantity || 1, [Validators.required, Validators.min(1)]),
        })
      );
    });

    this.selectedInvoiceId = invoice._id;
  }

  resetForm() {
    this.invoiceForm.reset({
      userId: null,
      total: 0,
      paymentMethod: 'cash',
      status: 'pending',
    });
    while (this.productsArray.length) this.productsArray.removeAt(0);
    this.addProduct();
    this.selectedInvoiceId = null;
  }

  // eliminar (preparar)
  deleteInvoice(id: string) {
    this.selectedInvoiceId = id;
    this.pendingAction = 'delete';
    this.showConfirmDialog = true;
  }

  // --- Método para que ADMIN cambie solo el status rápidamente en la lista ---
  changeStatus(invoice: any) {
    if (!invoice?._id) return;
    const newStatus = invoice.status || 'pending';
    this.invoiceService.updateInvoice(invoice._id, { status: newStatus }).subscribe({
      next: () => {
        this.toast.success('Status updated');
        this.loadInvoices();
      },
      error: (err) => {
        console.error('changeStatus error', err);
        this.toast.error('Error updating status');
        this.loadInvoices();
      },
    });
  }

  // regresar al dashboard admin (ejemplo)
  volverInicio(): void {
    this.router.navigate(['/dashboard']);
  }
  
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService } from '../../../../services/invoices.service';

@Component({
  selector: 'app-user-invoices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoices.html',
  styleUrls: ['./invoices.css']
})
export class UserInvoices {
  invoices: any[] = [];
  expandedId: string | null = null;

  constructor(
    private invoiceService: InvoiceService,
    private router: Router
  ) {
    this.invoiceService.getMyInvoices().subscribe({
      next: (res) => (this.invoices = res || []),
      error: (err) => console.error('Error cargando facturas de usuario', err),
    });
  }

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  sumSubtotal(items: any[]) {
    return items.reduce(
      (acc, it) => acc + (it?.productId?.price || 0) * (it?.quantity || 0),
      0
    );
  }

  volverDashboard() {
    this.router.navigate(['user/dashboard']);
  }
}

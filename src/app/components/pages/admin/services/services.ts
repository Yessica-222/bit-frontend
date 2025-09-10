import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../../services/services.service';
import { Service } from '../../../../models/service.model';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent {
  message: string = '';
  private serviceService = inject(ServiceService);
  private toast = inject(ToastrService);
  private router = inject(Router);

  services = signal<Service[]>([]);
  selectedServiceId: string | null = null;
  pendingAction: 'delete' | 'update' | null = null;
  showConfirmDialog = false;

  serviceForm = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', Validators.required),
    price: new FormControl<number>(0, Validators.required),
    duration: new FormControl<number>(0, Validators.required),
  });

  constructor() {
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getServices().subscribe({
      next: (data) => this.services.set(data),
      error: () => this.toast.error('Error cargando servicios')
    });
  }

  submitForm() {
    this.pendingAction = 'update';
    this.showConfirmDialog = true;
  }

  confirmAction() {
    const data: Service = {
      name: this.serviceForm.get('name')?.value || '',
      description: this.serviceForm.get('description')?.value || '',
      price: this.serviceForm.get('price')?.value ?? 0,
      duration: this.serviceForm.get('duration')?.value ?? 0,
    };

    if (this.pendingAction === 'update') {
      if (this.selectedServiceId) {
        this.serviceService.updateService(this.selectedServiceId, data).subscribe({
          next: () => {
            this.toast.success('Servicio actualizado');
            this.loadServices();
            this.resetForm();
          },
          error: () => this.toast.error('Error actualizando servicio')
        });
      } else {
        this.serviceService.createService(data).subscribe({
          next: () => {
            this.toast.success('Servicio creado');
            this.loadServices();
            this.resetForm();
          },
          error: () => this.toast.error('Error creando servicio')
        });
      }
    }

    if (this.pendingAction === 'delete' && this.selectedServiceId) {
      this.serviceService.deleteService(this.selectedServiceId).subscribe({
        next: () => {
          this.toast.success('Servicio eliminado');
          this.loadServices();
        },
        error: () => this.toast.error('Error eliminando servicio')
      });
    }

    this.cancelAction();
  }

  cancelAction() {
    this.showConfirmDialog = false;
    this.pendingAction = null;
    this.selectedServiceId = null;
  }

  editService(service: Service) {
  this.serviceForm.setValue({
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
  });
  this.selectedServiceId = service._id ?? null; // ✅ corregido
}

  deleteService(id: string) {
    this.selectedServiceId = id;
    this.pendingAction = 'delete';
    this.showConfirmDialog = true;
  }

  resetForm() {
    this.serviceForm.reset();
    this.selectedServiceId = null;
  }

  volverInicio(): void {
    this.router.navigate(['/dashboard']);
  }
}

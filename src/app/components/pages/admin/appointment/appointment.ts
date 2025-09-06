import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../../../../services/appointment.service';
import { User } from '../../../../models/users.model';
import { Service } from '../../../../models/service.model';
import { Appointment } from '../../../../models/appointment.model';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointment.html',
  styleUrls: ['./appointment.css']
})
export class AppointmentComponent {

  private appointmentService = inject(AppointmentService);
  private toast = inject(ToastrService);
  private router = inject(Router);

  appointments = signal<Appointment[]>([]);
  users = signal<User[]>([]);
  services = signal<Service[]>([]);

  selectedAppointmentId: string | null = null;
  pendingAction: 'delete' | 'update' | 'create' | null = null;
  showConfirmDialog = signal(false);

  appointmentForm = new FormGroup({
    userId: new FormControl('', Validators.required),
    serviceId: new FormControl('', Validators.required),
    appointmentDate: new FormControl('', Validators.required),
    status: new FormControl('pending')
  });

  constructor() {
    this.loadAppointments();
    this.loadUsers();
    this.loadServices();
  }

  // ====================== CARGAR DATOS ======================
  loadAppointments() {
    this.appointmentService.getAppointments().subscribe({
      next: (res: Appointment[]) => this.appointments.set(res),
      error: () => this.toast.error('Error cargando citas')
    });
  }

  loadUsers() {
    this.appointmentService.getUsers().subscribe({
      next: (res: User[]) => this.users.set(res),
      error: () => this.toast.error('Error cargando usuarios')
    });
  }

  loadServices() {
    this.appointmentService.getServices().subscribe({
      next: (res: Service[]) => this.services.set(res),
      error: () => this.toast.error('Error cargando servicios')
    });
  }

  // ====================== HELPERS ======================
  getUserNameById(user: any) {
  return user?.name ?? 'Desconocido';
}

getServiceNameById(service: any) {
  return service?.name ?? 'Desconocido';
}




  // ====================== ACCIONES ======================
  submitForm() {
    this.pendingAction = this.selectedAppointmentId ? 'update' : 'create';
    this.showConfirmDialog.set(true);
  }

  editAppointment(app: Appointment) {
  this.appointmentForm.patchValue({
    userId: (app as any).userId?._id || app.userId || '',   // toma el _id si viene objeto
    serviceId: (app as any).serviceId?._id || app.serviceId || '',
    appointmentDate: app.appointmentDate
      ? new Date(app.appointmentDate).toISOString().substring(0, 16)
      : '',
    status: app.status ?? 'pending'
  });
  this.selectedAppointmentId = app._id!;
}

  deleteAppointmentPrompt(id: string) {
    this.selectedAppointmentId = id;
    this.pendingAction = 'delete';
    this.showConfirmDialog.set(true);
  }

  confirmAction() {
    const formValue = this.appointmentForm.value;

    const data: Appointment = {
      userId: formValue.userId ?? '',
      serviceId: formValue.serviceId ?? '',
      appointmentDate: formValue.appointmentDate ? new Date(formValue.appointmentDate) : new Date(),
      status: (formValue.status as 'pending' | 'confirmed' | 'completed' | 'cancelled') ?? 'pending'
    };

    if (this.pendingAction === 'create') this.createAppointment(data);
    if (this.pendingAction === 'update' && this.selectedAppointmentId) this.updateAppointment(data);
    if (this.pendingAction === 'delete' && this.selectedAppointmentId) this.deleteAppointment(this.selectedAppointmentId);

    this.cancelAction();
  }

  cancelAction() {
    this.showConfirmDialog.set(false);
    this.pendingAction = null;
    this.selectedAppointmentId = null;
  }

  createAppointment(data: Appointment) {
    this.appointmentService.createAppointment(data).subscribe({
      next: () => {
        this.toast.success('Cita creada');
        this.loadAppointments();
        this.resetForm();
      },
      error: () => this.toast.error('Error creando cita')
    });
  }

  updateAppointment(data: Appointment) {
    if (!this.selectedAppointmentId) return;
    this.appointmentService.updateAppointment(this.selectedAppointmentId, data).subscribe({
      next: () => {
        this.toast.success('Cita actualizada');
        this.loadAppointments();
        this.resetForm();
      },
      error: () => this.toast.error('Error actualizando cita')
    });
  }

  deleteAppointment(id: string) {
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        this.toast.success('Cita eliminada');
        this.loadAppointments();
      },
      error: () => this.toast.error('Error eliminando cita')
    });
  }

  resetForm() {
    this.appointmentForm.reset({
      userId: '',
      serviceId: '',
      appointmentDate: '',
      status: 'pending'
    });
    this.selectedAppointmentId = null;
  }

  volverInicio() {
    this.router.navigate(['/dashboard']);
  }
}

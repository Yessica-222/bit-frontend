import { Component } from '@angular/core';
import { AppointmentService } from '../../../../services/appointment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.html',
  styleUrls: ['./appointments.css'],
})
export class UserAppointments {
  appointments: any[] = [];
  services: any[] = [];
  newAppointment = { serviceId: '', appointmentDate: '' };
  editAppointmentId: string | null = null;
  success: string | null = null;
  error: string | null = null;
  selectedService: any = null;

  // Variables para modal
showModal = false;
modalMessage = '';
confirmAction: (() => void) | null = null;

  constructor(private appointmentService: AppointmentService, private router: Router) {
  this.loadAppointments();
  this.loadServices();

  // 🔹 Preseleccionar servicio si viene desde Services
  const fromService = history.state?.service;
  if (fromService?._id) {
    this.newAppointment.serviceId = fromService._id;
  }
}

  loadAppointments() {
    this.appointmentService.getMyAppointments().subscribe({
      next: (data: any) => (this.appointments = data),
      error: () => (this.error = '❌ Error cargando tus citas'),
    });
  }

  loadServices() {
    this.appointmentService.getServices().subscribe({
      next: (data: any) => (this.services = data),
      error: () => (this.error = '❌ Error cargando servicios'),
    });
  }

  createAppointment() {
  if (!this.newAppointment.serviceId || !this.newAppointment.appointmentDate) return;

  const payload = {
    serviceId: this.newAppointment.serviceId,
    appointmentDate: new Date(this.newAppointment.appointmentDate).toISOString()
  };

  this.appointmentService.createAppointment(payload).subscribe({
    next: (data: any) => {
      this.appointments.push(data); // ✅ ya viene con serviceId.name
      this.success = '✅ Cita creada correctamente';
      this.error = null;
      this.newAppointment = { serviceId: '', appointmentDate: '' };
    },
    error: () => (this.error = '❌ Error al crear cita'),
  });
}


  startEdit(appointment: any) {
    this.editAppointmentId = appointment._id;
    this.newAppointment = {
      serviceId: appointment.serviceId._id || appointment.serviceId,
      appointmentDate: appointment.appointmentDate.split('.')[0] // formato ISO sin milisegundos
    };
  }

  updateAppointment() {
    if (!this.editAppointmentId) return;

    const payload = {
      serviceId: this.newAppointment.serviceId,
      appointmentDate: new Date(this.newAppointment.appointmentDate).toISOString()
    };

    this.appointmentService.updateAppointment(this.editAppointmentId, payload).subscribe({
      next: (data: any) => {
        const index = this.appointments.findIndex(a => a._id === this.editAppointmentId);
        if (index !== -1) this.appointments[index] = data;
        this.success = '✅ Cita actualizada correctamente';
        this.error = null;
        this.editAppointmentId = null;
        this.newAppointment = { serviceId: '', appointmentDate: '' };
      },
      error: () => (this.error = '❌ Error al actualizar cita'),
    });
  }

  cancelEdit() {
    this.editAppointmentId = null;
    this.newAppointment = { serviceId: '', appointmentDate: '' };
  }

  deleteAppointment(id: string) {
    this.appointmentService.deleteAppointment(id).subscribe({
      next: () => {
        this.appointments = this.appointments.filter(a => a._id !== id);
        this.success = '✅ Cita eliminada correctamente';
        this.error = null;
      },
      error: () => (this.error = '❌ Error al eliminar cita'),
    });
  }

  goBack() {
    this.router.navigate(['/user/dashboard']);
  }

  // Confirmación para actualizar
confirmUpdate() {
  this.modalMessage = '¿Deseas actualizar esta cita?';
  this.confirmAction = () => this.updateAppointment();
  this.showModal = true;
}

// Confirmación para eliminar
confirmDelete(id: string) {
  this.modalMessage = '¿Deseas eliminar esta cita?';
  this.confirmAction = () => this.deleteAppointment(id);
  this.showModal = true;
}

// Acciones del modal
onConfirm() {
  if (this.confirmAction) this.confirmAction();
  this.showModal = false;
}

onCancel() {
  this.showModal = false;
}

}

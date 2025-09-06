import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

// Reutilizamos tu AppointmentService para consumir /api/services
import { AppointmentService } from '../../../../services/appointment.service';

@Component({
  selector: 'app-user-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css'],
})
export class UserServices {
  // 🔹 Estado de UI
  loading = true;                 // Skeleton/loader
  error: string | null = null;    // Mensaje de error

  // 🔹 Data
  services: any[] = [];           // Lista de servicios

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {
    // Cargamos servicios apenas se construye el componente (no usamos ngOnInit)
    this.loadServices();
  }

  /** Carga los servicios desde la API pública GET /api/services */
  loadServices() {
    this.loading = true;
    this.error = null;

    this.appointmentService.getServices().subscribe({
      next: (data: any[]) => {
        this.services = data || [];
        this.loading = false;
      },
      error: () => {
        this.error = '❌ Error cargando servicios';
        this.loading = false;
      }
    });
  }

  /**
   * Navega al componente de citas con el servicio preseleccionado.
   * Usamos Navigation Extras `state` para pasar el objeto servicio.
   * En el componente de citas podrás leerlo con: `history.state?.service`
   */
  goToAppointment(service: any) {
    this.router.navigate(['/user/appointments'], { state: { service } });
  }

  /** Volver al dashboard de usuario */
  goBack() {
    this.router.navigate(['/user/dashboard']);
  }

  // --- Helpers de UI ---

  /** Formatea precio con separadores y símbolo $ */
  formatPrice(value: number): string {
    if (value === null || value === undefined) return '$0';
    return `$${value.toLocaleString()}`;
  }

  /** Convierte duración (minutos) en "X h Y min" o "Y min" */
  formatDuration(mins: number): string {
    if (!mins && mins !== 0) return '-';
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0 && m > 0) return `${h} h ${m} min`;
    if (h > 0) return `${h} h`;
    return `${m} min`;
  }
}

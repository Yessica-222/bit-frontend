// src/app/components/pages/services/services.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../services/services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class Services {   // ✅ nombre corregido
  services: any[] = [];
  showLoginModal: boolean = false;
  selectedService: any = null; // 👈 guarda el servicio elegido

  constructor(private serviceService: ServiceService, private router: Router) {
    this.loadServices();
  }

  loadServices() {
    this.serviceService.getServices().subscribe({
      next: (data: any) => {
        console.log("📌 Servicios recibidos desde backend:", data);

        // ✅ Ajusta si viene como array o dentro de un objeto
        if (Array.isArray(data)) {
          this.services = data;
        } else if (data && data.data) {
          this.services = data.data;
        } else {
          this.services = [];
          console.warn("⚠️ No se encontraron servicios en la respuesta");
        }
      },
      error: (err) => console.error('❌ Error cargando servicios', err)
    });
  }

  // cuando hace clic en "Agendar cita"
  openLoginModal(service: any) {
    this.selectedService = service; 
    localStorage.setItem('selectedService', JSON.stringify(service)); // persistimos
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  redirectToLogin() {
    this.showLoginModal = false;
    this.router.navigate(['/sign-in'], {
      queryParams: { redirect: 'user/appointments' }
    });
  }
}

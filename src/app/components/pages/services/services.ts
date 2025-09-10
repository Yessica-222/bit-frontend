import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceService } from '../../../services/services.service';
import { Router } from '@angular/router';
import { Service } from '../../../models/service.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.html',
  styleUrls: ['./services.css']
})
export class Services {
  services: Service[] = [];
  showLoginModal = false;
  selectedService: Service | null = null;

  constructor(private serviceService: ServiceService, private router: Router) {
    this.loadServices();
  }

  loadServices(): void {
    this.serviceService.getServices().subscribe({
      next: (data: Service[]) => {
        this.services = Array.isArray(data) ? data : [];
      },
      error: (err: any) => console.error('❌ Error cargando servicios', err)
    });
  }

  openLoginModal(service: Service): void {
    this.selectedService = service;
    localStorage.setItem('selectedService', JSON.stringify(service));
    this.showLoginModal = true;
  }

  closeLoginModal(): void {
    this.showLoginModal = false;
  }

  redirectToLogin(): void {
    this.showLoginModal = false;
    this.router.navigate(['/sign-in'], { queryParams: { redirect: 'user/appointments' } });
  }
}

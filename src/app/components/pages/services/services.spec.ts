import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Services } from './services';
import { ServiceService } from '../../../services/services.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Service } from '../../../models/service.model';

describe('Services Component', () => {
  let component: Services;
  let fixture: ComponentFixture<Services>;
  let serviceServiceSpy: jasmine.SpyObj<ServiceService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockServices: Service[] = [
    { _id: '1', name: 'Corte de cabello', price: 15000, description: 'Corte profesional', duration: 30 },
    { _id: '2', name: 'Manicure', price: 20000, description: 'Manicure completo', duration: 45 }
  ];

  beforeEach(async () => {
    const serviceSpyObj = jasmine.createSpyObj('ServiceService', ['getServices']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    // Mock de getServices para que devuelva observable por defecto
    serviceSpyObj.getServices.and.returnValue(of(mockServices));

    await TestBed.configureTestingModule({
      imports: [Services],
      providers: [
        { provide: ServiceService, useValue: serviceSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Services);
    component = fixture.componentInstance;
    serviceServiceSpy = TestBed.inject(ServiceService) as jasmine.SpyObj<ServiceService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load services on init', fakeAsync(() => {
    component.loadServices();
    tick();
    expect(serviceServiceSpy.getServices).toHaveBeenCalled();
    expect(component.services.length).toBe(2);
    expect(component.services[0].name).toBe('Corte de cabello');
  }));

  it('should handle error when loading services fails', fakeAsync(() => {
    serviceServiceSpy.getServices.and.returnValue(
      throwError(() => new Error('Error cargando servicios'))
    );
    const consoleSpy = spyOn(console, 'error');

    component.services = []; // asegurar que esté vacío antes de cargar
    component.loadServices();
    tick();

    expect(consoleSpy).toHaveBeenCalledWith('❌ Error cargando servicios', jasmine.any(Error));
    expect(component.services.length).toBe(0);
  }));

  it('should open login modal with selected service', () => {
    component.openLoginModal(mockServices[0]);
    expect(component.selectedService).toEqual(mockServices[0]);
    expect(component.showLoginModal).toBeTrue();
    expect(localStorage.getItem('selectedService')).toBe(JSON.stringify(mockServices[0]));
  });

  it('should close login modal', () => {
    component.showLoginModal = true;
    component.closeLoginModal();
    expect(component.showLoginModal).toBeFalse();
  });

  it('should redirect to login', () => {
    component.showLoginModal = true;
    component.redirectToLogin();
    expect(component.showLoginModal).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/sign-in'], { queryParams: { redirect: 'user/appointments' } });
  });
});

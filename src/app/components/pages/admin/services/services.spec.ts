import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesComponent } from '../../admin/services/services'; // asegúrate de la ruta correcta
import { ServiceService } from '../../../../services/services.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Service } from '../../../../models/service.model';

describe('ServicesComponent', () => {
  let component: ServicesComponent;
  let fixture: ComponentFixture<ServicesComponent>;
  let serviceService: jasmine.SpyObj<ServiceService>;
  let toast: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  const mockService: Service = {
    _id: '1',
    name: 'Servicio Test',
    description: 'Descripción Test',
    price: 100,
    duration: 60,
  };

  beforeEach(async () => {
    const serviceSpy = jasmine.createSpyObj('ServiceService', [
      'getServices',
      'createService',
      'updateService',
      'deleteService',
    ]);
    const toastSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: ServiceService, useValue: serviceSpy },
        { provide: ToastrService, useValue: toastSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    serviceService = TestBed.inject(ServiceService) as jasmine.SpyObj<ServiceService>;
    toast = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    serviceService.getServices.and.returnValue(of([mockService]));

    fixture = TestBed.createComponent(ServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load services on init', () => {
    expect(component.services()).toEqual([mockService]);
  });

  it('should open confirm dialog on submitForm', () => {
    component.submitForm();
    expect(component.pendingAction).toBe('update');
    expect(component.showConfirmDialog).toBeTrue();
  });

  it('should create a new service when confirmAction and no selectedServiceId', () => {
    serviceService.createService.and.returnValue(of(mockService));
    component.pendingAction = 'update';
    component.selectedServiceId = null;

    component.serviceForm.setValue({
      name: mockService.name,
      description: mockService.description,
      price: mockService.price,
      duration: mockService.duration,
    });

    component.confirmAction();

    expect(serviceService.createService).toHaveBeenCalledWith(jasmine.objectContaining({
      name: mockService.name,
      description: mockService.description,
      price: mockService.price,
      duration: mockService.duration,
    }));
    expect(toast.success).toHaveBeenCalledWith('Servicio creado');
    expect(component.selectedServiceId).toBeNull();
  });

  it('should update existing service when confirmAction with selectedServiceId', () => {
    serviceService.updateService.and.returnValue(of(mockService));
    component.pendingAction = 'update';
    component.selectedServiceId = mockService._id!; // <- non-null assertion

    component.serviceForm.setValue({
      name: mockService.name,
      description: mockService.description,
      price: mockService.price,
      duration: mockService.duration,
    });

    component.confirmAction();

    expect(serviceService.updateService).toHaveBeenCalledWith(
      mockService._id!, // <- non-null assertion
      jasmine.objectContaining({
        name: mockService.name,
        description: mockService.description,
        price: mockService.price,
        duration: mockService.duration,
      })
    );
    expect(toast.success).toHaveBeenCalledWith('Servicio actualizado');
  });

  it('should delete service when confirmAction with delete pendingAction', () => {
    serviceService.deleteService.and.returnValue(of({}));
    component.pendingAction = 'delete';
    component.selectedServiceId = mockService._id!; // <- non-null assertion

    component.confirmAction();

    expect(serviceService.deleteService).toHaveBeenCalledWith(mockService._id!); // <- non-null assertion
    expect(toast.success).toHaveBeenCalledWith('Servicio eliminado');
  });

  it('should reset form correctly', () => {
    component.selectedServiceId = '123';
    component.serviceForm.setValue({
      name: 'Test',
      description: 'Desc',
      price: 10,
      duration: 5,
    });
    component.resetForm();

    expect(component.selectedServiceId).toBeNull();
    expect(component.serviceForm.value).toEqual({
      name: null,
      description: null,
      price: null,
      duration: null,
    });
  });

  it('should edit a service', () => {
    component.editService(mockService);
    expect(component.serviceForm.value).toEqual({
      name: mockService.name,
      description: mockService.description,
      price: mockService.price,
      duration: mockService.duration,
    });
    expect(component.selectedServiceId).toBe(mockService._id!);
  });

  it('should cancel action', () => {
    component.selectedServiceId = '1';
    component.pendingAction = 'update';
    component.showConfirmDialog = true;

    component.cancelAction();

    expect(component.showConfirmDialog).toBeFalse();
    expect(component.pendingAction).toBeNull();
    expect(component.selectedServiceId).toBeNull();
  });

  it('should navigate back to dashboard', () => {
    component.volverInicio();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});

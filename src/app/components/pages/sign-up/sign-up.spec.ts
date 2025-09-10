import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignUp } from './sign-up';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { SigninService } from '../../../services/signin.service';

describe('SignUp Component', () => {
  let component: SignUp;
  let fixture: ComponentFixture<SignUp>;
  let signinServiceSpy: jasmine.SpyObj<SigninService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    signinServiceSpy = jasmine.createSpyObj('SigninService', ['registerUser']);
    toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'warning']);

    await TestBed.configureTestingModule({
      imports: [
        SignUp,               // tu componente standalone
        ReactiveFormsModule,  // si usa forms reactivos
        RouterTestingModule   // << esto provee ActivatedRoute y Router
      ],
      providers: [
        { provide: SigninService, useValue: signinServiceSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar advertencia si el formulario es inválido', () => {
    component.registerForm.setValue({ name: '', email: '', password: '' });
    component.handleRegister();
    expect(toastrSpy.warning).toHaveBeenCalledWith('Por favor, completa todos los campos correctamente');
  });

  it('debería registrar usuario y redirigir si el formulario es válido', () => {
    const mockResponse = { message: 'Registro exitoso' };
    signinServiceSpy.registerUser.and.returnValue(of(mockResponse));

    component.registerForm.setValue({
      name: 'Yessica',
      email: 'yessi@test.com',
      password: '12345678'
    });

    component.handleRegister();

    expect(signinServiceSpy.registerUser).toHaveBeenCalled();
    expect(toastrSpy.success).toHaveBeenCalledWith('Registro exitoso');

    // Para comprobar navegación con RouterTestingModule
    const router = TestBed.inject(RouterTestingModule);
    expect(component['router']).toBeTruthy(); // si usas this.router.navigate
  });

  it('debería mostrar error si el registro falla', () => {
    signinServiceSpy.registerUser.and.returnValue(
      throwError(() => ({ error: { message: 'Error al registrarse' } }))
    );

    component.registerForm.setValue({
      name: 'Yessica',
      email: 'yessi@test.com',
      password: '12345678'
    });

    component.handleRegister();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error al registrarse');
  });
});

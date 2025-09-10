import { of, throwError } from 'rxjs';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SignIn } from './sign-in';
import { SigninService } from '../../../services/signin.service';
import { Router, ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

describe('SignIn Component', () => {
  let component: SignIn;
  let signinService: jasmine.SpyObj<SigninService>;
  let router: jasmine.SpyObj<Router>;
  let toast: jasmine.SpyObj<ToastrService>;
  let route: Partial<ActivatedRoute>;

  beforeEach(() => {
    signinService = jasmine.createSpyObj('SigninService', ['loginUser', 'getUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    toast = jasmine.createSpyObj('ToastrService', ['warning', 'error']);

    // Mock de ActivatedRoute usando convertToParamMap
    route = {
      snapshot: {
        queryParamMap: convertToParamMap({}) // Vacío por defecto
      } as any
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: SigninService, useValue: signinService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: route },
        { provide: ToastrService, useValue: toast }
      ]
    });

    component = TestBed.runInInjectionContext(() => new SignIn());
    localStorage.clear();
  });

  it('should show warning if form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.handleSubmit();
    expect(toast.warning).toHaveBeenCalledWith('Todos los campos son obligatorios');
  });

  it('should login admin and navigate to /dashboard', fakeAsync(() => {
    component.loginForm.setValue({ email: 'admin@test.com', password: '1234' });
    localStorage.setItem('token', 'dummyToken');

    signinService.loginUser.and.returnValue(of({ token: 'dummyToken' }));
    signinService.getUser.and.returnValue({ role: 'admin' });

    component.handleSubmit();
    tick();

    expect(localStorage.getItem('token')).toBe('dummyToken');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should login user and navigate to /user/dashboard if no redirect', fakeAsync(() => {
    component.loginForm.setValue({ email: 'user@test.com', password: '1234' });
    localStorage.setItem('token', 'dummyToken');

    signinService.loginUser.and.returnValue(of({ token: 'dummyToken' }));
    signinService.getUser.and.returnValue({ role: 'user' });

    component.handleSubmit();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/user/dashboard']);
  }));

  it('should login user and navigate to redirect route if present', fakeAsync(() => {
    component.loginForm.setValue({ email: 'user@test.com', password: '1234' });
    localStorage.setItem('token', 'dummyToken');

    signinService.loginUser.and.returnValue(of({ token: 'dummyToken' }));
    signinService.getUser.and.returnValue({ role: 'user' });

    // Cambiamos el queryParamMap usando convertToParamMap
    (route.snapshot as any).queryParamMap = convertToParamMap({ redirect: 'checkout' });

    component.handleSubmit();
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/checkout']);
  }));

  it('should show error if login fails', fakeAsync(() => {
    component.loginForm.setValue({ email: 'user@test.com', password: '1234' });

    signinService.loginUser.and.returnValue(throwError(() => ({ error: { message: 'Credenciales inválidas' } })));

    component.handleSubmit();
    tick();

    expect(toast.error).toHaveBeenCalledWith('Credenciales inválidas');
  }));
});

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { authGuard } from './auth-guard';
import { SigninService } from '../services/signin.service';

describe('authGuard', () => {
  let router: jasmine.SpyObj<Router>;
  let signin: jasmine.SpyObj<SigninService>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    signin = jasmine.createSpyObj('SigninService', ['getUser']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: SigninService, useValue: signin }
      ]
    });

    localStorage.clear();
  });

  // Función que ejecuta el guard dentro del contexto de inyección
  const runGuard = (route?: any, state?: any) => {
    return TestBed.runInInjectionContext(() => authGuard(route, state));
  };

  it('should redirect to /sign-in if no token', () => {
    const result = runGuard({} as any, { url: '/test' } as any);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
    expect(localStorage.getItem('redirectUrl')).toBe('/test');
  });

  it('should allow access if token exists and role matches', () => {
    localStorage.setItem('token', '123');
    signin.getUser.and.returnValue({ role: 'admin' });

    const result = runGuard({ data: { role: 'admin' } } as any, { url: '/admin' } as any);
    expect(result).toBeTrue();
  });

  it('should allow access if token exists and no role required', () => {
    localStorage.setItem('token', '123');
    signin.getUser.and.returnValue({ role: 'user' });

    const result = runGuard({} as any, { url: '/any' } as any);
    expect(result).toBeTrue();
  });

  it('should redirect admin role mismatch to /dashboard', () => {
    localStorage.setItem('token', '123');
    signin.getUser.and.returnValue({ role: 'admin' });

    const result = runGuard({ data: { role: 'user' } } as any, { url: '/user' } as any);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should redirect user role mismatch to /user/dashboard', () => {
    localStorage.setItem('token', '123');
    signin.getUser.and.returnValue({ role: 'user' });

    const result = runGuard({ data: { role: 'admin' } } as any, { url: '/admin' } as any);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/user/dashboard']);
  });

  it('should redirect unknown role to /sign-in', () => {
    localStorage.setItem('token', '123');
    signin.getUser.and.returnValue({ role: 'unknown' });

    const result = runGuard({ data: { role: 'admin' } } as any, { url: '/admin' } as any);
    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/sign-in']);
  });
});

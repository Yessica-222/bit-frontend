// src/app/guards/auth-guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { SigninService } from '../services/signin.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const router = inject(Router);
  const signin = inject(SigninService);

  const token = localStorage.getItem('token');
  if (!token) {
    //  Guardar la ruta donde estaba el usuario
    localStorage.setItem('redirectUrl', state.url);
    router.navigate(['/sign-in']);
    return false;
  }

  const user = signin.getUser();
  const requiredRole = route.data?.['role'] as string | undefined;

  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === 'admin') router.navigate(['/dashboard']);
    else if (user?.role === 'user') router.navigate(['/user/dashboard']);
    else router.navigate(['/sign-in']);
    return false;
  }

  return true;
}
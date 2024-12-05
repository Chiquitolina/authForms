import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('authToken');

  if (token) {
    return true; // Permite el acceso
  } else {
    // Redirige al usuario a la página de login
    router.navigate(['']);
    return false;
  }
};

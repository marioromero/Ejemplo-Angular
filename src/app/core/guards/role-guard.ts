import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Obtenemos el usuario actual de nuestra Signal
  const user = authService.currentUser();

  // 2. Obtenemos el rol específico que esta ruta exige (lo configuraremos en app.routes.ts)
  const expectedRole = route.data['expectedRole'];

  // 3. Verificamos que el usuario exista y que su rol coincida con el esperado
  if (user && user.role === expectedRole) {
    return true; // ¡Adelante tienes el rango necesario!
  }

  // 4. Si es un intruso (ej. un Turista intentando entrar a /crear-oferta),
  // lo pateamos de vuelta a su dashboard seguro.
  router.navigate(['/dashboard']);
  return false;
};

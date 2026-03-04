import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; // <-- IMPORTAMOS EL GUARD

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    // Protegemos esta ruta y todas sus sub-rutas ("hijos") con el Guard
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: '',
    redirectTo: 'dashboard', // Ahora por defecto intentamos ir al dashboard
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

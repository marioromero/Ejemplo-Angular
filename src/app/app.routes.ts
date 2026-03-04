import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard'; // <-- IMPORTAMOS EL GUARD
import { roleGuard } from './core/guards/role-guard';

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

// ZONA EXCLUSIVA EMPRESARIOS
  {
    path: 'admin-ofertas',
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'empresario' }, // rol requerido
    loadComponent: () => import('./features/admin-ofertas/admin-ofertas').then(m => m.AdminOfertas)
  },

  // ZONA EXCLUSIVA TURISTAS
  {
    path: 'mis-puntos',
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'turista' }, // rol requerido
    loadComponent: () => import('./features/mis-puntos/mis-puntos').then(m => m.MisPuntos)
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

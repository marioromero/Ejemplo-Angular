import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },

  // ZONA PRIVADA (Envuelve todo lo que requiere sesión)
  {
    path: '',
    canActivate: [authGuard], // El guard se aplica al layout, protegiendo todo lo de adentro
    loadComponent: () => import('./core/layout/main-layout/main-layout').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'animales',
        loadComponent: () => import('./features/animales/animal-list/animal-list').then(m => m.AnimalListComponent)
      },
      {
        path: 'animales/nuevo',
        canActivate: [roleGuard], // Este guard extra solo aplica a esta ruta específica
        data: { expectedRole: 'empresario' },
        loadComponent: () => import('./features/animales/animal-form/animal-form').then(m => m.AnimalFormComponent)
      },
      {
        path: 'animales/editar/:id',
        canActivate: [roleGuard],
        data: { expectedRole: 'empresario' },
        loadComponent: () => import('./features/animales/animal-form/animal-form').then(m => m.AnimalFormComponent)
      },
      // Si mañana agregas otro mantenedor, solo lo agregas aquí:
      // { path: 'usuarios', loadComponent: ... }

      { path: '', redirectTo: 'animales', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' }
];

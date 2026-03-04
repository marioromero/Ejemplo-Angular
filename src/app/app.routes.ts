import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    // Usamos Lazy Loading. Esto hace que Angular solo descargue el código del Login cuando el usuario visite esta URL.
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**', // Si escriben una URL que no existe, los mandamos al login
    redirectTo: 'login'
  }
];

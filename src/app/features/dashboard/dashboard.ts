import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html', // Verifica que el nombre del archivo coincida
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  // 1. OBLIGATORIO que sea public para que el HTML lo pueda leer
  public authService = inject(AuthService);
  private router = inject(Router);

  // 2. Debe estar dentro de la clase
  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

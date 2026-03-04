import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Inyección de dependencias
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  // Manejo de estado local de la UI usando Signals
  public isLoading = signal(false);
  public errorMessage = signal<string | null>(null);

  // Definición del formulario reactivo
  public loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Iniciamos el proceso
    this.isLoading.set(true);
    this.errorMessage.set(null); // Limpiamos errores anteriores

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
        // Éxito: El token ya se guardó en el AuthService. Solo nos queda navegar.
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']); // Ajustaremos esta ruta después
      },
      error: (err: Error) => {
        // Fallo: Aquí termina el viaje del error que dejó pasar el AuthService
        this.isLoading.set(false);
        this.errorMessage.set(err.message || 'Error al iniciar sesión');
      }
    });
  }
}

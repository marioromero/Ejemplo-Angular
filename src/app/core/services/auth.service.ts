import {Injectable, inject, signal} from '@angular/core';
import {ApiService} from './api.service';
import {tap, catchError} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {AuthResponse, LoginCredentials, User} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = inject(ApiService);
  public currentUser = signal<User | null>(null);

  constructor() {
    this.checkInitialAuth();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.api.post<AuthResponse>('/auth/v1/token?grant_type=password', credentials)
      .pipe(
        tap((response) => this.setSession(response))
        // No hay catchError aquí. El error formateado por ApiService sube directo al Componente.
      );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No hay refresh token disponible'));
    }

    return this.api.post<AuthResponse>('/auth/v1/token?grant_type=refresh_token', {
      refresh_token: refreshToken
    }).pipe(
      tap((response) => this.setSession(response)),
      catchError((error: any) => {
        // Excepción a la regla: Se usa catchError porque el negocio exige limpiar estado
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    this.currentUser.set(null);
  }

  private setSession(authResult: any): void {
    localStorage.setItem('access_token', authResult.access_token);
    localStorage.setItem('refresh_token', authResult.refresh_token);

    // Mapeamos la respuesta del server a nuestra Interfaz estricta
    const mappedUser: User = {
      id: authResult.user.id,
      email: authResult.user.email,
      role: authResult.user.user_metadata?.role // <-- Aquí extraemos el rol
    };

    localStorage.setItem('user_data', JSON.stringify(mappedUser));
    this.currentUser.set(mappedUser);
  }

  private checkInitialAuth(): void {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        this.currentUser.set(JSON.parse(userData));
      } catch (e) {
        this.logout();
      }
    }
  }
}

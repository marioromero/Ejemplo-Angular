import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  // Angular 20 usa la función inject() en lugar del constructor clásico
  private readonly http = inject(HttpClient);

  // Centralizamos la URL base. Si mañana cambia a Laravel, solo se cambia en environment
  private readonly baseUrl = environment.serviceUrl;

  /**
   * Método GET Genérico
   * La <T> significa que el componente que llame a este método debe definir
   * qué tipo de dato espera recibir (Ej: api.get<Turista[]>('/turistas'))
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params }).pipe(
      catchError(this.formatErrors)
    );
  }

  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, JSON.stringify(body)).pipe(
      catchError(this.formatErrors)
    );
  }

  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, JSON.stringify(body)).pipe(
      catchError(this.formatErrors)
    );
  }

  patch<T>(path: string, body: any = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, JSON.stringify(body)).pipe(
      catchError(this.formatErrors)
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`).pipe(
      catchError(this.formatErrors)
    );
  }

  // Interceptamos errores de red a nivel global antes de que lleguen al componente
  private formatErrors(error: any) {
    console.error('Error atrapado en ApiService:', error);
    // Aquí a futuro podríamos gatillar un Toast/Snackbar global de error
    return throwError(() => new Error(error.message || 'Error de conexión con el servidor'));
  }
}

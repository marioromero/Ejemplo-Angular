import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  // Angular 20 usa la función inject() en lugar del constructor clásico
  private readonly http = inject(HttpClient);
  private readonly logger = inject(LoggerService);

  // Centralizamos la URL base. Si mañana cambia a Laravel, solo se cambia en environment
  private readonly baseUrl = environment.serviceUrl;

  /**
   * Método GET Genérico
   * La <T> significa que el componente que llame a este método debe definir
   * qué tipo de dato espera recibir (Ej: api.get<Turista[]>('/turistas'))
   */
get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params }).pipe(
      catchError((err) => this.formatErrors(err, path))
    );
  }

  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body).pipe(
      catchError((err) => this.formatErrors(err, path))
    );
  }

  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body).pipe(
      catchError((err) => this.formatErrors(err, path))
    );
  }

  patch<T>(path: string, body: any = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body).pipe(
      catchError((err) => this.formatErrors(err, path))
    );
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`).pipe(
      catchError((err) => this.formatErrors(err, path))
    );
  }

private formatErrors = (err: any, path: string) => {
    this.logger.error(`Falló la petición HTTP a ${path}`, err);

    // Extraemos el mensaje dependiendo de cómo lo envíe el backend
    const apiMessage = err?.error?.error_description || err?.error?.message || err?.error?.msg;

    return throwError(() => new Error(apiMessage || 'Error de conexión con el servidor'));
  }
}

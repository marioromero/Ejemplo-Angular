import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // 1. Obtenemos el token actual
  const token = localStorage.getItem('access_token');

  // 2. Clonamos y preparamos la petición original con los headers
  let authReq = req.clone({
    headers: req.headers.set('apikey', environment.serviceKey)
  });

  if (token) {
    authReq = authReq.clone({
      headers: authReq.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  // 3. Enviamos la petición y nos quedamos "escuchando" la respuesta
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el error es 401 (Unauthorized) y NO estamos intentando hacer login ni refresh...
      if (error.status === 401 && !req.url.includes('/auth/v1/token')) {

        // Entramos en modo rescate: pedimos un nuevo token
        return authService.refreshToken().pipe(
          switchMap((response) => {
            // ¡Éxito! Tenemos token fresco.
            // Clonamos la petición original que había fallado, le ponemos el token nuevo...
            const retriedReq = req.clone({
              headers: req.headers
                .set('apikey', environment.serviceKey)
                .set('Authorization', `Bearer ${response.access_token}`)
            });

            // ...y la volvemos a enviar al backend como si nada hubiera pasado.
            return next(retriedReq);
          }),
          catchError((refreshError) => {
            // Si el refresh también falla (ej. el refresh_token expiró),
            // el AuthService ya se encargó de hacer logout().
            // Solo dejamos que el error siga su curso.
            return throwError(() => refreshError);
          })
        );
      }

      // Si es cualquier otro error (500, 404, 400), no hacemos nada especial aquí,
      // dejamos que pase hacia el ApiService para que lo formatee.
      return throwError(() => error);
    })
  );
};

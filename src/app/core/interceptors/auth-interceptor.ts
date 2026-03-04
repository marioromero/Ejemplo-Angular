import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Obtenemos el token guardado (por ahora directo de localStorage)
  const token = localStorage.getItem('access_token');

  // 2. Las peticiones (req) son inmutables en Angular.
  // Por lo tanto, debemos clonar los headers y agregar los nuestros.
  // Siempre agregamos la API Key que identifica a nuestro proyecto (Supabase/Laravel)
  let headers = req.headers.set('apikey', environment.serviceKey);

  // 3. Si el usuario está logueado (existe el token), se lo adjuntamos
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // 4. Clonamos la petición original inyectándole los nuevos headers
  const authReq = req.clone({ headers });

  // 5. Dejamos que la petición continúe su viaje hacia el ApiService
  return next(authReq);
};

import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  // Logs informativos: Solo se muestran si estamos en desarrollo local
  log(message: string, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.log(`[APP LOG]: ${message}`, ...optionalParams);
    }
  }

  // Logs de errores: Se muestran siempre, y aquí es donde a futuro
  // enviaríamos el error a un servidor externo (Sentry, Base de Datos, etc.)
  error(message: string, error?: any) {
    console.error(`[APP ERROR]: ${message}`, error || '');
    // TODO: Implementar envío a servidor de monitoreo remoto
  }

  warn(message: string, ...optionalParams: any[]) {
    if (isDevMode()) {
      console.warn(`[APP WARN]: ${message}`, ...optionalParams);
    }
  }
}

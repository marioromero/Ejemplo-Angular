// Separar la interfaz del Usuario es clave, porque a futuro
// la usarán las cabeceras, los perfiles, los menús, etc.
export interface User {
  id: string;
  email: string;
  role?: 'empresario' | 'turista'; // Tipado estricto literal
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

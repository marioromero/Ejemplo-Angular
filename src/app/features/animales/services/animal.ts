import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { Observable } from 'rxjs';
import { Animal } from '../models/animal';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {
  private api = inject(ApiService);
  private readonly basePath = '/rest/v1/animales';

  getAnimales(): Observable<Animal[]> {
    // Supabase requiere ?select=* para traer todos los campos
    return this.api.get<Animal[]>(`${this.basePath}?select=*`);
  }

  getAnimalById(id: string): Observable<Animal[]> {
    // Supabase filtra con ?columna=eq.valor
    return this.api.get<Animal[]>(`${this.basePath}?id=eq.${id}&select=*`);
  }

  createAnimal(animal: Animal): Observable<any> {
    return this.api.post<any>(this.basePath, animal);
  }

  updateAnimal(id: string, animal: Partial<Animal>): Observable<any> {
    return this.api.patch<any>(`${this.basePath}?id=eq.${id}`, animal);
  }

  deleteAnimal(id: string): Observable<any> {
    return this.api.delete<any>(`${this.basePath}?id=eq.${id}`);
  }
}

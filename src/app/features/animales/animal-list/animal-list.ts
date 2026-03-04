import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnimalService } from '../services/animal';
import { AuthService } from '../../../core/services/auth.service';
import { Animal } from '../models/animal';
import { Spinner } from '../../../shared/components/spinner/spinner';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Spinner],
  templateUrl: './animal-list.html',
  styleUrls: ['./animal-list.css']
})
export class AnimalListComponent implements OnInit {
  private animalService = inject(AnimalService);
  public authService = inject(AuthService); // Para leer el rol en el HTML

  public animales = signal<Animal[]>([]);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarAnimales();
  }

  cargarAnimales(): void {
    this.isLoading.set(true);
    this.animalService.getAnimales().subscribe({
      next: (data) => {
        this.animales.set(data);
        this.isLoading.set(false);
      },
      error: (err: Error) => {
        this.errorMessage.set('Error al cargar los animales: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  eliminarAnimal(id: string | undefined): void {
    if (!id || !confirm('¿Estás seguro de eliminar este registro?')) return;

    this.animalService.deleteAnimal(id).subscribe({
      next: () => this.cargarAnimales(), // Recargar la lista
      error: (err: Error) => alert('Error al eliminar: ' + err.message)
    });
  }
}

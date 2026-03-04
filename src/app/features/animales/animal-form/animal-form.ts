import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AnimalService } from '../services/animal';
import { Animal } from '../models/animal';

@Component({
  selector: 'app-animal-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './animal-form.html',
  styleUrls: ['./animal-form.css']
})
export class AnimalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private animalService = inject(AnimalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public isEditMode = signal<boolean>(false);
  public isLoading = signal<boolean>(false);
  public currentId = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  public animalForm = this.fb.group({
    nombre: ['', Validators.required],
    especie: ['', Validators.required],
    edad: [null as number | null, Validators.min(0)]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.currentId.set(id);
      this.cargarDatosAnimal(id);
    }
  }

  cargarDatosAnimal(id: string): void {
    this.isLoading.set(true);
    this.animalService.getAnimalById(id).subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.animalForm.patchValue(data[0]);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Error al cargar datos: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.animalForm.invalid) {
      this.animalForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.animalForm.value as Animal;

    const peticion = this.isEditMode()
      ? this.animalService.updateAnimal(this.currentId()!, formValue)
      : this.animalService.createAnimal(formValue);

    peticion.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/animales']);
      },
      error: (err) => {
        this.errorMessage.set('Error al guardar: ' + err.message);
        this.isLoading.set(false);
      }
    });
  }
}

import { Component, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserRole } from '../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  @Output() close = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<void>();

  userForm: FormGroup;
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  readonly UserRole = UserRole;
  readonly roles = [
    { value: UserRole.USER, label: 'Utilisateur' },
    { value: UserRole.ADMIN, label: 'Administrateur' },
    { value: UserRole.EMERGENCY_SERVICE, label: 'Service d\'urgence' }
  ];

  constructor() {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      role: [UserRole.USER, Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    this.userService.createUser(this.userForm.value).subscribe({
      next: () => {
        this.userCreated.emit();
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors de la création de l\'utilisateur');
        this.isSubmitting.set(false);
      }
    });
  }

  onClose(): void {
    this.close.emit();
  }

  getFieldError(fieldName: string): string | null {
    const field = this.userForm.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) return 'Ce champ est requis';
      if (field.errors?.['email']) return 'Email invalide';
      if (field.errors?.['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors?.['pattern']) return 'Format invalide';
    }
    return null;
  }
}
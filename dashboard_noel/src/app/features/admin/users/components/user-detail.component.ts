import { Component, Input, Output, EventEmitter, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User, UserRole } from '../models/user.model';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) user!: User;
  @Output() close = new EventEmitter<void>();
  @Output() userUpdated = new EventEmitter<void>();
  @Output() userDeleted = new EventEmitter<number>();

  editForm: FormGroup | null = null;
  isEditing = signal(false);
  isSubmitting = signal(false);
  error = signal<string | null>(null);

  readonly UserRole = UserRole;
  readonly roles = [
    { value: UserRole.USER, label: 'Utilisateur' },
    { value: UserRole.ADMIN, label: 'Administrateur' },
    { value: UserRole.EMERGENCY_SERVICE, label: 'Service d\'urgence' }
  ];

  constructor() {
    this.editForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{10,15}$/)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.editForm) {
      this.editForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        role: this.user.role
      });
    }
  }

  onEdit(): void {
    this.isEditing.set(true);
    this.error.set(null);
  }

  onCancelEdit(): void {
    this.isEditing.set(false);
    this.error.set(null);
    if (this.editForm) {
      this.editForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        role: this.user.role
      });
    }
  }

  onSubmit(): void {
    if (!this.editForm || this.editForm.invalid) {
      this.editForm?.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.error.set(null);

    this.userService.updateUser(this.user.id, this.editForm.value).subscribe({
      next: () => {
        this.isEditing.set(false);
        this.isSubmitting.set(false);
        this.userUpdated.emit();
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Erreur lors de la mise à jour');
        this.isSubmitting.set(false);
      }
    });
  }

  onDelete(): void {
    this.userDeleted.emit(this.user.id);
  }

  onClose(): void {
    this.close.emit();
  }

  getRoleBadgeClass(role: UserRole): string {
    const classes: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'bg-emerald-100 text-emerald-700',
      [UserRole.USER]: 'bg-blue-100 text-blue-700',
      [UserRole.EMERGENCY_SERVICE]: 'bg-blue-100 text-blue-700'
    };
    return classes[role];
  }

  getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Administrateur',
      [UserRole.USER]: 'Utilisateur',
      [UserRole.EMERGENCY_SERVICE]: 'Service d\'urgence'
    };
    return labels[role];
  }

  getFieldError(fieldName: string): string | null {
    const field = this.editForm?.get(fieldName);
    if (field?.invalid && field?.touched) {
      if (field.errors?.['required']) return 'Ce champ est requis';
      if (field.errors?.['email']) return 'Email invalide';
      if (field.errors?.['minlength']) return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
      if (field.errors?.['pattern']) return 'Format invalide';
    }
    return null;
  }
}
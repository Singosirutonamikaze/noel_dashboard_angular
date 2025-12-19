import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UpdateProfileDto } from '../models/profile.model';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-form.component.html'
})
export class ProfileFormComponent implements OnInit {
  @Input() initialData?: UpdateProfileDto;
  @Input() title = 'Modifier le profil';
  @Input() submitLabel = 'Enregistrer';
  @Input() showCancel = true;

  @Output() submitForm = new EventEmitter<UpdateProfileDto>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  isSubmitting = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName: [this.initialData?.firstName || '', Validators.required],
      lastName: [this.initialData?.lastName || '', Validators.required],
      email: [this.initialData?.email || '', [Validators.required, Validators.email]],
      phone: [this.initialData?.phone || '', Validators.required],
      address: [this.initialData?.address || ''],
      country: [this.initialData?.country || ''],
      city: [this.initialData?.city || '']
    });
  }

  onSubmit(): void {
    if (this.form.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      this.error.set(null);
      this.success.set(null);
      this.submitForm.emit(this.form.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  setSubmitting(value: boolean): void {
    this.isSubmitting.set(value);
  }

  setError(message: string): void {
    this.error.set(message);
    this.isSubmitting.set(false);
  }

  setSuccess(message: string): void {
    this.success.set(message);
    this.isSubmitting.set(false);
  }

  resetForm(): void {
    this.form.reset(this.initialData);
    this.error.set(null);
    this.success.set(null);
  }
}
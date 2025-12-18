import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  isLoading: boolean = false;
  errorMessage: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login({ identifier: this.email, password: this.password }).subscribe({
      next: (response) => {
        this.router.navigate(['/admin/dashboard']);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Email ou mot de passe incorrect';
        this.isLoading = false;
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
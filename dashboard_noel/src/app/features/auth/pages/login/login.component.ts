import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from '../../components/login-form.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email!: string;
  password!: string;

  constructor(private authService: AuthService, private router: Router) {}

  @ViewChild(LoginFormComponent)
    loginForm!: LoginFormComponent;

  login() {
    const identifier = this.loginForm.email;
    const password = this.loginForm.password;
    const loginData = { identifier, password };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Connecté!', response);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Erreur:', error);
      },
    });
  }
}
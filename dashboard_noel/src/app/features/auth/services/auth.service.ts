import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterSimpleRequest,
} from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1';
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  constructor(private http: HttpClient, private router: Router) {
    let storedUser = null;
    if (this.isBrowser()) {
      storedUser = localStorage.getItem('currentUser');
    }
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  // Connexion
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response);
      })
    );
  }

  // Inscription simple
  registerSimple(data: RegisterSimpleRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register-simple`, data).pipe(
      tap((response) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response);
      })
    );
  }

  // Inscription complète
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data).pipe(
      tap((response) => {
        localStorage.setItem('currentUser', JSON.stringify(response));
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response);
      })
    );
  }

  getUserInfo(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Déconnexion
  logout(): void {
    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated(): boolean {
    return !!this.currentUserValue && !!this.getToken();
  }

  // Récupérer le token
  getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('token');
    }
    return null;
  }

  // Récupérer les headers avec le token
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}

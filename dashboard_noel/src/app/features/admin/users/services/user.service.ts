import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, UserStats, CreateUserRequest, UpdateUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1';

  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$ = this.usersSubject.asObservable();

  private statsSubject = new BehaviorSubject<UserStats | null>(null);
  public stats$ = this.statsSubject.asObservable();

  private getAuthHeaders(): HttpHeaders {
    let token = '';
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('token') || '';
    }
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  getAllUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/admin/users`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((users) => this.usersSubject.next(users)));
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/admin/users/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  getUserStats(): Observable<UserStats> {
    return this.http
      .get<UserStats>(`${this.apiUrl}/admin/stats/users`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap((stats) => this.statsSubject.next(stats)));
  }

  createUser(userData: CreateUserRequest): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/admin/users`, userData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap(() => this.getAllUsers().subscribe()));
  }

  updateUser(id: number, userData: UpdateUserRequest): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/admin/users/${id}`, userData, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap(() => this.getAllUsers().subscribe()));
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/admin/users/${id}`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(tap(() => this.getAllUsers().subscribe()));
  }

  changeUserRole(id: number, role: string): Observable<User> {
    return this.http
      .patch<User>(
        `${this.apiUrl}/admin/users/${id}/role`,
        { role },
        {
          headers: this.getAuthHeaders(),
        }
      )
      .pipe(tap(() => this.getAllUsers().subscribe()));
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users/search`, {
      headers: this.getAuthHeaders(),
      params: { q: query },
    });
  }
}

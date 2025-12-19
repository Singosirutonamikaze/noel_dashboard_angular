import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserProfile, UpdateProfileDto, VehicleDto, UserSettings, PrivacySettings } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1';

  private profileSubject = new BehaviorSubject<UserProfile | null>(null);
  public profile$ = this.profileSubject.asObservable();

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

  // Get current user profile
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/users/profile`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }

  // Update profile
  updateProfile(data: UpdateProfileDto): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/users/profile`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }

  // Delete account
  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/profile`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update vehicle information
  updateVehicle(data: VehicleDto): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/users/profile/vehicle`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }

  // Get user settings
  getSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(`${this.apiUrl}/users/profile/settings`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update user settings
  updateSettings(settings: UserSettings): Observable<UserSettings> {
    return this.http.put<UserSettings>(`${this.apiUrl}/users/profile/settings`, settings, {
      headers: this.getAuthHeaders()
    });
  }

  // Get privacy settings
  getPrivacySettings(): Observable<PrivacySettings> {
    return this.http.get<PrivacySettings>(`${this.apiUrl}/users/profile/privacy`, {
      headers: this.getAuthHeaders()
    });
  }

  // Update privacy settings
  updatePrivacySettings(settings: PrivacySettings): Observable<PrivacySettings> {
    return this.http.put<PrivacySettings>(`${this.apiUrl}/users/profile/privacy`, settings, {
      headers: this.getAuthHeaders()
    });
  }

  // Upload profile photo
  uploadPhoto(file: File): Observable<UserProfile> {
    const formData = new FormData();
    formData.append('photo', file);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put<UserProfile>(`${this.apiUrl}/users/profile/photo`, formData, {
      headers
    }).pipe(
      tap(profile => this.profileSubject.next(profile))
    );
  }
}
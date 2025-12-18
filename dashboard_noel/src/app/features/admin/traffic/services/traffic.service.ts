import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { TrafficStats, UserStats, IncidentStats, DashboardStats } from '../models/traffic.model';

@Injectable({
  providedIn: 'root'
})
export class TrafficService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1';
  
  private trafficStatsSubject = new BehaviorSubject<TrafficStats | null>(null);
  public trafficStats$ = this.trafficStatsSubject.asObservable();
  
  private userStatsSubject = new BehaviorSubject<UserStats | null>(null);
  public userStats$ = this.userStatsSubject.asObservable();
  
  private incidentStatsSubject = new BehaviorSubject<IncidentStats | null>(null);
  public incidentStats$ = this.incidentStatsSubject.asObservable();

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getTrafficStats(): Observable<TrafficStats> {
    return this.http.get<TrafficStats>(`${this.apiUrl}/admin/stats/traffic`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(stats => this.trafficStatsSubject.next(stats))
    );
  }

  getUserStats(): Observable<UserStats> {
    return this.http.get<UserStats>(`${this.apiUrl}/admin/stats/users`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(stats => this.userStatsSubject.next(stats))
    );
  }

  getIncidentStats(): Observable<IncidentStats> {
    return this.http.get<IncidentStats>(`${this.apiUrl}/admin/stats/incidents`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap(stats => this.incidentStatsSubject.next(stats))
    );
  }

  getAllStats(): Observable<DashboardStats> {
    return combineLatest([
      this.getUserStats(),
      this.getIncidentStats(),
      this.getTrafficStats()
    ]).pipe(
      map(([userStats, incidentStats, trafficStats]) => ({
        userStats,
        incidentStats,
        trafficStats
      }))
    );
  }

  refreshAllStats(): void {
    this.getAllStats().subscribe();
  }
}
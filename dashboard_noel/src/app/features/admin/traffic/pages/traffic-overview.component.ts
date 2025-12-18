import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficService } from '../services/traffic.service';
import { TrafficStats, UserStats, IncidentStats, TrafficStatus } from '../models/traffic.model';
import { TrafficChartComponent } from '../components/traffic-chart.component';
import { TrafficTableComponent } from '../components/traffic-table.component';

@Component({
  selector: 'app-traffic-overview',
  standalone: true,
  imports: [CommonModule, TrafficChartComponent, TrafficTableComponent],
  templateUrl: './traffic-overview.component.html'
})
export class TrafficOverviewComponent implements OnInit {
  private readonly trafficService = inject(TrafficService);
  
  trafficStats = signal<TrafficStats | null>(null);
  userStats = signal<UserStats | null>(null);
  incidentStats = signal<IncidentStats | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  readonly TrafficStatus = TrafficStatus;

  ngOnInit(): void {
    this.loadAllStats();
  }

  loadAllStats(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.trafficService.getAllStats().subscribe({
      next: (stats) => {
        this.userStats.set(stats.userStats);
        this.incidentStats.set(stats.incidentStats);
        this.trafficStats.set(stats.trafficStats);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Erreur lors du chargement des statistiques');
        this.isLoading.set(false);
        console.error(err);
      }
    });
  }

  getTrafficStatusColor(status: TrafficStatus): string {
    const colors: Record<TrafficStatus, string> = {
      [TrafficStatus.FLUIDE]: 'bg-emerald-100 text-emerald-700',
      [TrafficStatus.MODERE]: 'bg-yellow-100 text-yellow-700',
      [TrafficStatus.DENSE]: 'bg-orange-100 text-orange-700',
      [TrafficStatus.BLOQUE]: 'bg-red-100 text-red-700'
    };
    return colors[status];
  }

  getTrafficStatusLabel(status: TrafficStatus): string {
    const labels: Record<TrafficStatus, string> = {
      [TrafficStatus.FLUIDE]: 'Fluide',
      [TrafficStatus.MODERE]: 'Modéré',
      [TrafficStatus.DENSE]: 'Dense',
      [TrafficStatus.BLOQUE]: 'Bloqué'
    };
    return labels[status];
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'ADMIN': 'Administrateurs',
      'USER': 'Utilisateurs',
      'EMERGENCY_SERVICE': 'Services d\'urgence'
    };
    return labels[role] || role;
  }

  onRefresh(): void {
    this.loadAllStats();
  }
}
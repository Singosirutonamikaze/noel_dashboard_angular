import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficStats } from '../models/traffic.model';

@Component({
  selector: 'app-traffic-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traffic-table.component.html'
})
export class TrafficTableComponent {
  @Input() trafficStats: TrafficStats | null = null;

  getSeverityLabel(severity: string): string {
    const labels: Record<string, string> = {
      'FAIBLE': 'Faible',
      'MOYENNE': 'Moyenne',
      'ELEVEE': 'Élevée',
      'CRITIQUE': 'Critique'
    };
    return labels[severity] || severity;
  }

  getSeverityColorClass(severity: string): string {
    const colors: Record<string, string> = {
      'FAIBLE': 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700',
      'MOYENNE': 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-700',
      'ELEVEE': 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700',
      'CRITIQUE': 'bg-gradient-to-r from-red-100 to-red-200 text-red-700'
    };
    return colors[severity] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700';
  }

  getTotalIncidents(): number {
    if (!this.trafficStats?.popularZones) return 0;
    return this.trafficStats.popularZones.reduce((sum, zone) => sum + zone.incidentCount, 0);
  }

  getTopZone(): string {
    if (!this.trafficStats?.popularZones || this.trafficStats.popularZones.length === 0) {
      return '-';
    }
    const topZone = this.trafficStats.popularZones.reduce((prev, current) => 
      (current.incidentCount > prev.incidentCount) ? current : prev
    );
    return topZone.zoneName;
  }
}
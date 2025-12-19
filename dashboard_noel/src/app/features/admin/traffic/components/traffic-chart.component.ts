import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentStats } from '../models/traffic.model';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-traffic-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './traffic-chart.component.html',
  styleUrls: ['./traffic-chart.component.css']
})
export class TrafficChartComponent implements OnChanges {
  @Input() incidentStats: IncidentStats | null = null;

  public pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [] }]
  };
  public pieChartType: ChartType = 'pie';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incidentStats']) {
      this.updateChart();
    }
  }

  updateChart() {
    if (!this.incidentStats?.incidentsByType) {
      this.pieChartData = { labels: [], datasets: [{ data: [] }] };
      return;
    }
    const entries = Object.entries(this.incidentStats.incidentsByType);
    this.pieChartData = {
      labels: entries.map(([type]) => this.getIncidentTypeLabel(type)),
      datasets: [{ data: entries.map(([, count]) => count as number) }]
    };
  }

  getIncidentTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'ACCIDENT': 'Accident',
      'EMBOUTEILLAGE': 'Embouteillage',
      'ROUTE_FERMEE': 'Route fermée',
      'TRAVAUX': 'Travaux',
      'MANIFESTATION': 'Manifestation',
      'METEO': 'Conditions météo',
      'AUTRE': 'Autre'
    };
    return labels[type] || type;
  }
}
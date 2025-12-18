import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentStats } from '../models/traffic.model';

@Component({
  selector: 'app-traffic-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traffic-chart.component.html',
  styleUrls: ['./traffic-chart.component.css']
})
export class TrafficChartComponent {
  @Input() incidentStats: IncidentStats | null = null;
}
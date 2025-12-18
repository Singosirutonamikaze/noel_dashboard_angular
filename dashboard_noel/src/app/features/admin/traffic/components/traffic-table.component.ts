import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrafficStats } from '../models/traffic.model';

@Component({
  selector: 'app-traffic-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './traffic-table.component.html',
  styleUrls: ['./traffic-table.component.css']
})
export class TrafficTableComponent {
  @Input() trafficStats: TrafficStats | null = null;
}
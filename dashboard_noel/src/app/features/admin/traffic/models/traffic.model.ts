export enum TrafficStatus {
  FLUIDE = 'FLUIDE',
  MODERE = 'MODERE',
  DENSE = 'DENSE',
  BLOQUE = 'BLOQUE'
}

export interface TrafficStats {
  averageIncidentsPerDay: number;
  currentTrafficStatus: TrafficStatus;
  popularZones: PopularZone[];
}

export interface PopularZone {
  zoneName: string;
  incidentCount: number;
  averageSeverity: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  usersByRole: Record<string, number>;
  totalReports: number;
  averageReportsPerUser: number;
  usersWithFavoriteRoutes: number;
  usersWithWatchedZones: number;
}

export interface IncidentStats {
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  verifiedIncidents: number;
  incidentsByType: Record<string, number>;
  incidentsBySeverity: Record<string, number>;
  averageResolutionTimeMinutes: number;
  incidentsReportedToday: number;
  incidentsReportedThisWeek: number;
  incidentsReportedThisMonth: number;
}

export interface DashboardStats {
  userStats: UserStats;
  incidentStats: IncidentStats;
  trafficStats: TrafficStats;
}
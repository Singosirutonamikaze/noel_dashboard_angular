export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  country?: string;
  city?: string;
  photoUrl?: string;
  role: string;
  vehicleType?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleLicensePlate?: string;
  totalReports: number;
  verifiedReports: number;
  reputationScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  country?: string;
  city?: string;
}

export interface VehicleDto {
  vehicleType?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleLicensePlate?: string;
}

export interface UserSettings {
  enableNotifications: boolean;
  notifyOnIncidents: boolean;
  notifyOnTrafficJams: boolean;
  notifyOnFavoriteRoutes: boolean;
  preferredLanguage: string;
  mapStyle: string;
  showTrafficLayer: boolean;
  autoRefresh: boolean;
  refreshIntervalSeconds: number;
}

export interface PrivacySettings {
  profileVisibility: 'PUBLIC' | 'PRIVATE' | 'FRIENDS';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowDataSharing: boolean;
}
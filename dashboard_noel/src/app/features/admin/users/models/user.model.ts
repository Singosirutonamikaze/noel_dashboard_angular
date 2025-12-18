export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  EMERGENCY_SERVICE = 'EMERGENCY_SERVICE'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  country: string | null;
  token: string | null;
  type: string | null;
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

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  country?: string;
}
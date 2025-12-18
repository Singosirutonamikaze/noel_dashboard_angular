
// Interfaces
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterSimpleRequest {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  address: string;
  role?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: string;
  country: string;
}
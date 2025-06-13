export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Me {
  user_name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  sub: string;
  name: string;
  login: string;
  profile: string;
  expires_in?: number;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}

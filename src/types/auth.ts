export interface LoginCredentials {
  email: string;
  password: string;
  twoFactorCode?: string;
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

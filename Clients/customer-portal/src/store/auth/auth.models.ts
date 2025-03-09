export interface RegistrationRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationResponse {
  userId: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginOrRefreshResponse {
  userId: string;
  accessToken: string;
  accessTokenExpires: Date;
  refreshTokenExpires: Date;
  isEmailConfirmed: boolean;
}

export interface RefreshOrLogoutRequest {
  userId: string;
}

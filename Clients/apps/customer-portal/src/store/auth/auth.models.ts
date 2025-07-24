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
  clientRole: string;
}

export interface GenerateCodeRequest {
  email: string;
}

export interface GenerateCodeResponse {
  email: string;
  codeExpires: Date;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  userId: string;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegistrationResponse {
  userId: string;
}

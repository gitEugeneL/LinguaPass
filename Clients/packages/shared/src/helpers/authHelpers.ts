import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  email: string;
  role: string;
}

export const createAuthHeader = (accessToken: string | null) => {
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
};

export const readJWTRole = (accessToken: string) => {
  try {
    const decoded = jwtDecode<JwtPayload>(accessToken);
    return decoded.role;
  } catch (error) {
    console.error('authentication error', error);
    return null;
  }
};

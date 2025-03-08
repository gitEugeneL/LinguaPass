import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { authUrls } from './auth.urls.ts';
import {
  LoginOrRefreshResponse,
  LoginRequest,
  RegistrationRequest,
  RegistrationResponse
} from './auth.models.ts';

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  accessTokenExpires: Date | null;
  refreshTokenExpires: Date | null;
  isEmailConfirmed: boolean;
  error: string | null;
  isLoading: boolean;

  registration: (email: string, password: string, confirmPassword: string) => void;
  login: (email: string, password: string) => void;
  refresh: () => void;
  logout: () => void;
  resetError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  accessToken: null,
  accessTokenExpires: null,
  refreshTokenExpires: null,
  isEmailConfirmed: false,
  error: null,
  isLoading: false,

  registration: async (email, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    const request: RegistrationRequest = { email, password, confirmPassword };
    try {
      const { data } = await axios.post<RegistrationResponse>(authUrls.registration, request);
      set({ userId: data.userId });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    const request: LoginRequest = { email, password };
    try {
      const { data } = await axios.post<LoginOrRefreshResponse>(authUrls.login, request, {
        withCredentials: true // response with secure cookie (refresh token)
      });
      set({
        userId: data.userId,
        accessToken: data.accessToken,
        accessTokenExpires: data.accessTokenExpires,
        refreshTokenExpires: data.refreshTokenExpires,
        isEmailConfirmed: data.isEmailConfirmed
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data);
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  refresh: () => {},

  logout: () => {},

  resetError: () => set({ error: null })
}));

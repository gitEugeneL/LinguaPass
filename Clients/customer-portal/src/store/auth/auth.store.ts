import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  LoginOrRefreshResponse,
  LoginRequest,
  RefreshOrLogoutRequest,
  RegistrationRequest,
  RegistrationResponse
} from './auth.models.ts';
import axios, { AxiosError } from 'axios';
import { authUrls } from './auth.urls.ts';

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  accessTokenExpires: Date | null;
  refreshTokenExpires: Date | null;
  isEmailConfirmed: boolean;
  error: string | null;
  isLoading: boolean;
  refreshAttempts: number;

  registration: (email: string, password: string, confirmPassword: string) => void;
  login: (email: string, password: string) => void;
  refresh: () => void;
  logout: () => void;

  resetError: () => void;
  resetState: () => void;
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      userId: null,
      accessToken: null,
      accessTokenExpires: null,
      refreshTokenExpires: null,
      isEmailConfirmed: false,
      error: null,
      isLoading: false,
      refreshAttempts: 0,

      registration: async (email: string, password: string, confirmPassword: string) => {
        set({ isLoading: true, error: null });
        const request: RegistrationRequest = { email, password, confirmPassword };
        try {
          const { data } = await axios.post<RegistrationResponse>(authUrls.registration, request);
          set({ userId: data.userId });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      login: async (email: string, password: string) => {
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
            isEmailConfirmed: data.isEmailConfirmed,
            refreshAttempts: 0
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      refresh: () => {
        const MAX_REFRESH_ATTEMPTS = 5;
        const userId = get().userId;
        if (userId) {
          const attemptRefresh = async (attempts: number) => {
            if (attempts >= MAX_REFRESH_ATTEMPTS) {
              get().resetState();
              return;
            }
            set({ error: null });
            const request: RefreshOrLogoutRequest = { userId: userId };
            try {
              const { data } = await axios.post<LoginOrRefreshResponse>(authUrls.refresh, request, {
                withCredentials: true
              });
              set({
                accessToken: data.accessToken,
                accessTokenExpires: data.accessTokenExpires,
                refreshTokenExpires: data.refreshTokenExpires,
                refreshAttempts: 0
              });
            } catch (error) {
              if (error instanceof AxiosError) {
                set((state) => ({
                  error: error.response?.data,
                  refreshAttempts: state.refreshAttempts + 1
                }));
                setTimeout(() => attemptRefresh(attempts + 1), 1000);
              }
            }
          };
          attemptRefresh(get().refreshAttempts);
        }
      },

      logout: () => {},

      resetState: () => {
        set({
          userId: null,
          accessToken: null,
          refreshTokenExpires: null,
          isEmailConfirmed: false,
          error: null,
          isLoading: false,
          refreshAttempts: 0
        });
      },

      resetError: () => set({ error: null })
    }),
    {
      name: 'AuthStore',
      partialize: (state: AuthState) => ({
        userId: state.userId,
        refreshTokenExpires: state.refreshTokenExpires,
        isEmailConfirmed: state.isEmailConfirmed
      })
    }
  )
);

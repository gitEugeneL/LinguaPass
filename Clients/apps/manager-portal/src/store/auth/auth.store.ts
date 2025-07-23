import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { persist } from 'zustand/middleware';
import { create } from 'zustand/react';

import type {
  LoginOrRefreshResponse,
  LoginRequest,
  RefreshOrLogoutRequest
} from './auth.models.ts';
import { authUrls } from './auth.urls.ts';

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  accessTokenExpires: Date | null;
  refreshTokenExpires: Date | null;
  email: string | null;
  error: string | null;
  isLoading: boolean;
  refreshAttempts: number;
  isRefreshTokenProblem: boolean | null;
  role: string | null;

  login: (email: string, password: string) => void;
  refresh: () => void;
  logout: () => void;

  resetError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      role: null,
      accessToken: null,
      accessTokenExpires: null,
      refreshTokenExpires: null,
      email: null,
      isRefreshTokenProblem: false,
      error: null,
      isLoading: false,
      refreshAttempts: 0,

      // TODO add  admin role here (read JWT)
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        const request: LoginRequest = { email, password };
        try {
          const { data } = await axios.post<LoginOrRefreshResponse>(authUrls.login, request, {
            withCredentials: true // response with secure cookie (refresh token)
          });
          set({
            email: email,
            accessToken: data.accessToken,
            accessTokenExpires: data.accessTokenExpires,
            refreshTokenExpires: data.refreshTokenExpires,
            isRefreshTokenProblem: false,
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

      // TODO add admin role here (read JWT)
      refresh: async () => {
        const MAX_REFRESH_ATTEMPTS = 10;
        const userId = get().userId;
        if (userId) {
          const attemptRefresh = async (attempts: number) => {
            if (attempts === MAX_REFRESH_ATTEMPTS) {
              set({
                isRefreshTokenProblem: true,
                refreshAttempts: 0,
                isLoading: false
              });
              return;
            }
            set({ error: null, isRefreshTokenProblem: false, isLoading: true });
            const request: RefreshOrLogoutRequest = { userId: userId };
            try {
              const { data } = await axios.post<LoginOrRefreshResponse>(authUrls.refresh, request, {
                withCredentials: true // response with secure cookie (refresh token)
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
          await attemptRefresh(get().refreshAttempts);
        }
      },

      logout: async () => {
        const userId = get().userId;
        if (userId) {
          set({ isLoading: true, error: null });
          try {
            set({
              userId: null,
              accessToken: null,
              refreshTokenExpires: null,
              isRefreshTokenProblem: false,
              email: null,
              error: null,
              isLoading: false,
              refreshAttempts: 0
            });
            const request: RefreshOrLogoutRequest = { userId: userId };
            await axios.post(authUrls.logout, request, {
              headers: createAuthHeader(get().accessToken),
              withCredentials: true
            });
          } catch (error) {
            if (error instanceof AxiosError) {
              set({ error: 'Invalid logout' });
            }
          } finally {
            set({ isLoading: false });
          }
        }
      },

      resetError: () => set({ error: null })
    }),
    {
      name: 'auth',
      partialize: (state: AuthState) => ({
        userId: state.userId,
        email: state.email,
        refreshTokenExpires: state.refreshTokenExpires,
        isRefreshTokenProblem: state.isRefreshTokenProblem
      })
    }
  )
);

import { createAuthHeader, readJWTRole } from '@clients/shared';
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
  clientRole: string | null;

  login: (email: string, password: string) => void;
  refresh: () => void;
  logout: () => void;

  resetState: () => void;
  resetError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      accessToken: null,
      accessTokenExpires: null,
      refreshTokenExpires: null,
      email: null,
      isRefreshTokenProblem: false,
      error: null,
      isLoading: false,
      refreshAttempts: 0,
      clientRole: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        const request: LoginRequest = { email, password };
        try {
          const { data } = await axios.post<LoginOrRefreshResponse>(authUrls.login, request, {
            withCredentials: true // response with secure cookie (refresh token)
          });

          const role = readJWTRole(data.accessToken);
          if (role === 'ADMIN') {
            set({
              clientRole: role,
              userId: data.userId,
              email: email,
              accessToken: data.accessToken,
              accessTokenExpires: data.accessTokenExpires,
              refreshTokenExpires: data.refreshTokenExpires,
              isRefreshTokenProblem: false,
              refreshAttempts: 0
            });
          } else {
            set({ error: 'login or password is incorrect' });
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      refresh: async () => {
        const MAX_REFRESH_ATTEMPTS = 10;
        const userId = get().userId;
        const clientRole = get().clientRole;
        if (userId && clientRole) {
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
            const request: RefreshOrLogoutRequest = { userId: userId, clientRole: clientRole };
            try {
              const { data } = await axios.post<LoginOrRefreshResponse>(authUrls.refresh, request, {
                withCredentials: true // response with secure cookie (refresh token)
              });
              const role = readJWTRole(data.accessToken);
              if (role === 'ADMIN') {
                set({
                  clientRole: role,
                  userId: data.userId,
                  accessToken: data.accessToken,
                  accessTokenExpires: data.accessTokenExpires,
                  refreshTokenExpires: data.refreshTokenExpires,
                  refreshAttempts: 0
                });
              } else {
                set({
                  error: 'login or password is incorrect',
                  refreshAttempts: get().refreshAttempts + 1
                });
              }
            } catch (error) {
              if (error instanceof AxiosError) {
                set({
                  error: error.response?.data,
                  refreshAttempts: get().refreshAttempts + 1
                });
                setTimeout(() => attemptRefresh(attempts + 1), 1000);
              }
            }
          };
          await attemptRefresh(get().refreshAttempts);
        }
      },

      logout: async () => {
        const userId = get().userId;
        const clientRole = get().clientRole;
        if (userId && clientRole) {
          set({ isLoading: true, error: null });
          try {
            get().resetState();
            const request: RefreshOrLogoutRequest = { userId: userId, clientRole: clientRole };
            await axios.post(authUrls.logout, request, {
              headers: createAuthHeader(get().accessToken),
              withCredentials: true
            });
          } catch (error) {
            if (error instanceof AxiosError) {
              console.log('Invalid logout');
            }
          } finally {
            set({ isLoading: false });
          }
        }
      },

      resetState: () => {
        set({
          userId: null,
          accessToken: null,
          refreshTokenExpires: null,
          isRefreshTokenProblem: false,
          email: null,
          error: null,
          isLoading: false,
          refreshAttempts: 0,
          clientRole: null
        });
      },

      resetError: () => set({ error: null })
    }),
    {
      name: 'auth',
      partialize: (state: AuthState) => ({
        userId: state.userId,
        email: state.email,
        refreshTokenExpires: state.refreshTokenExpires,
        isRefreshTokenProblem: state.isRefreshTokenProblem,
        clientRole: state.clientRole
      })
    }
  )
);

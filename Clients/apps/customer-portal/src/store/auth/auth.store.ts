import { createAuthHeader, readJWTRole } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type {
  GenerateCodeRequest,
  GenerateCodeResponse,
  LoginOrRefreshResponse,
  LoginRequest,
  RefreshOrLogoutRequest,
  RegistrationRequest,
  RegistrationResponse,
  ResetPasswordRequest,
  ResetPasswordResponse
} from './auth.models.ts';
import { authUrls } from './auth.urls.ts';

interface AuthState {
  userId: string | null;
  accessToken: string | null;
  accessTokenExpires: Date | null;
  refreshTokenExpires: Date | null;
  isEmailConfirmed: boolean;
  codeExpires: Date | null;
  email: string | null;
  error: string | null;
  isLoading: boolean;
  refreshAttempts: number;
  isPasswordChanged: boolean | null;
  isRefreshTokenProblem: boolean | null;
  clientRole: string | null;

  registration: (email: string, password: string, confirmPassword: string) => void;
  login: (email: string, password: string) => void;
  generateCode: (email: string) => void;
  resetPassword: (code: string, password: string, confirmPassword: string) => void;
  refresh: () => void;
  logout: () => void;

  resetError: () => void;
  resetCodeData: () => void;
  resetState: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userId: null,
      accessToken: null,
      accessTokenExpires: null,
      refreshTokenExpires: null,
      codeExpires: null,
      email: null,
      isEmailConfirmed: false,
      isPasswordChanged: false,
      isRefreshTokenProblem: false,
      error: null,
      isLoading: false,
      refreshAttempts: 0,
      clientRole: null,

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
          const role = readJWTRole(data.accessToken);
          if (role === 'CUSTOMER') {
            set({
              email: email,
              userId: data.userId,
              accessToken: data.accessToken,
              accessTokenExpires: data.accessTokenExpires,
              refreshTokenExpires: data.refreshTokenExpires,
              isEmailConfirmed: data.isEmailConfirmed,
              isRefreshTokenProblem: false,
              refreshAttempts: 0,
              clientRole: role
            });
          } else {
            set({
              error: 'login or password is incorrect'
            });
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      generateCode: async (email: string) => {
        set({ isLoading: true, error: null, codeExpires: null, email: null });
        const request: GenerateCodeRequest = { email };
        try {
          const { data } = await axios.post<GenerateCodeResponse>(authUrls.generateCode, request);
          set({ codeExpires: data.codeExpires, email: email });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      resetPassword: async (code: string, password: string, confirmPassword: string) => {
        const email = get().email;
        if (email) {
          set({ isLoading: true, error: null, isPasswordChanged: false });
          const request: ResetPasswordRequest = { email, code, password, confirmPassword };
          try {
            const { data } = await axios.post<ResetPasswordResponse>(
              authUrls.resetPassword,
              request
            );
            set({ userId: data.userId, isPasswordChanged: true, codeExpires: null });
          } catch (error) {
            if (error instanceof AxiosError) {
              set({ error: 'Code is invalid or expired :(' });
            }
          } finally {
            set({ isLoading: false });
          }
        }
      },

      refresh: async () => {
        const MAX_REFRESH_ATTEMPTS = 3;
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
            const request: RefreshOrLogoutRequest = {
              userId: userId,
              clientRole: clientRole
            };
            try {
              const { data } = await axios.post<LoginOrRefreshResponse>(authUrls.refresh, request, {
                withCredentials: true // response with secure cookie (refresh token)
              });
              const role = readJWTRole(data.accessToken);
              if (role === 'CUSTOMER') {
                set({
                  clientRole: role,
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
              set({ error: 'Invalid logout' });
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
          isEmailConfirmed: false,
          isPasswordChanged: false,
          codeExpires: null,
          isRefreshTokenProblem: false,
          email: null,
          error: null,
          isLoading: false,
          refreshAttempts: 0,
          clientRole: null
        });
      },

      resetError: () => set({ error: null }),

      resetCodeData: () => set({ email: null, codeExpires: null })
    }),
    {
      name: 'auth',
      partialize: (state: AuthState) => ({
        userId: state.userId,
        codeExpires: state.codeExpires,
        email: state.email,
        refreshTokenExpires: state.refreshTokenExpires,
        isEmailConfirmed: state.isEmailConfirmed,
        isRefreshTokenProblem: state.isRefreshTokenProblem,
        clientRole: state.clientRole
      })
    }
  )
);

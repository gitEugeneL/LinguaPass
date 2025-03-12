import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
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
import axios, { AxiosError } from 'axios';
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

export const useAuthStore = create(
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
              set({ error: error.response?.data });
            }
          } finally {
            set({ isLoading: false });
          }
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
          isPasswordChanged: false,
          codeExpires: null,
          email: null,
          error: null,
          isLoading: false,
          refreshAttempts: 0
        });
      },

      resetError: () => set({ error: null }),

      resetCodeData: () =>
        set({ email: null, codeExpires: null, error: 'Code is invalid or expired :(' })
    }),
    {
      name: 'AuthStore',
      partialize: (state: AuthState) => ({
        userId: state.userId,
        codeExpires: state.codeExpires,
        email: state.email,
        refreshTokenExpires: state.refreshTokenExpires,
        isEmailConfirmed: state.isEmailConfirmed
      })
    }
  )
);

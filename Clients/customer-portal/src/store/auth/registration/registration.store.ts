import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { authUrls } from '../auth.urls.ts';
import { RegistrationRequest, RegistrationResponse } from './registration.models.ts';

interface RegistrationStore {
  userId: string | null;
  error: string | null;
  isLoading: boolean;
  resetError: () => void;
  registration: (email: string, password: string, confirmPassword: string) => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  userId: null,
  isLoading: false,
  error: null,

  resetError: () => set({ error: null }),

  registration: async (email, password, confirmPassword) => {
    set({ isLoading: true, error: null });

    const request: RegistrationRequest = {
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };

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
  }
}));

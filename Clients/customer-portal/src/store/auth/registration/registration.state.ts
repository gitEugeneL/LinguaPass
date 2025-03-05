import { create } from 'zustand';
import { RegistrationRequest, RegistrationResponse } from './registration.models.ts';
import axios, { AxiosError } from 'axios';
import { authUrls } from '../auth.urls.ts';

interface RegistrationState {
  userId: string | null;
  error: string | null;
  isLoading: boolean;
  resetError: () => void;
  registration: (data: RegistrationRequest) => void;
}

export const useRegistrationState = create<RegistrationState>((set) => ({
  userId: null,
  isLoading: false,
  isSuccess: false,
  error: null,

  resetError: () => set({ error: null }),

  registration: async (request: RegistrationRequest) => {
    set({ isLoading: true, error: null });

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

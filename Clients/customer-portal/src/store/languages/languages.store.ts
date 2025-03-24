import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '../auth/auth.store.ts';
import { GetLanguagesResponse, Language } from './language.models.ts';
import { languageUrls } from './languages.urls.ts';

interface LanguagesState {
  languages: Language[];
  isLoading: boolean;
  error: string | null;

  getActiveLanguage: () => void;
}

export const useLanguagesStore = create<LanguagesState>((set) => ({
  languages: [],
  isLoading: false,
  error: null,

  getActiveLanguage: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get<GetLanguagesResponse>(languageUrls.getLanguages, {
        params: { filter: 'active' },
        headers: { Authorization: `Bearer ${useAuthStore.getState().accessToken}` }
      });
      set({
        error: null,
        languages: data.items
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  }
}));

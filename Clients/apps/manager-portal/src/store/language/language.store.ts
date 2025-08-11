import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type { GetLanguagesResponse, Language } from './language.models.ts';
import { languageUrls } from './language.urls.ts';

interface LanguageState {
  languages: Language[];
  currentLanguage: Language | null;
  isLoading: boolean;
  error: string | null;

  getLanguages: () => Promise<void>;
  getLanguageById: (languageId: string) => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  languages: [],
  currentLanguage: null,
  isLoading: false,
  error: null,

  getLanguages: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get<GetLanguagesResponse>(languageUrls.getLanguages, {
        params: { filter: 'all' },
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      set({ languages: data.items });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getLanguageById: async (languageId) => {
    set({ isLoading: true, currentLanguage: null });
    try {
      let language = get().languages.find((l) => l.languageId === languageId);
      if (!language) {
        await get().getLanguages();
        language = get().languages.find((l) => l.languageId === languageId);
      }
      set({
        currentLanguage: language || null,
        error: language ? null : 'Language not found'
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

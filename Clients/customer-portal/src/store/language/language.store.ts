import { create } from 'zustand';
import {
  ChooseLanguageRequest,
  ChooseLanguageResponse,
  GetCurrentLanguageIdResponse,
  GetLanguagesResponse,
  Language
} from './language.models.ts';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { languageUrls } from './language.urls.ts';
import { createAuthHeader } from '../../helpers/authHelpers.ts';
import { useAuthStore } from '../auth/auth.store.ts';

interface LanguagesState {
  languages: Language[];
  isLoading: boolean;
  error: string | null;

  currentLanguage: Language | null;
  currentLanguageId: string | null;

  getActiveLanguages: () => Promise<void>;
  chooseLanguage: (languageId: string) => Promise<void>;
  getCurrentLanguage: () => Promise<void>;
}

export const useLanguagesStore = create<LanguagesState>()(
  persist(
    (set, get) => ({
      languages: [],
      isLoading: false,
      error: null,

      currentLanguage: null,
      currentLanguageId: null,

      getActiveLanguages: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axios.get<GetLanguagesResponse>(languageUrls.getLanguages, {
            params: { filter: 'active' },
            headers: createAuthHeader(useAuthStore.getState().accessToken)
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
      },

      chooseLanguage: async (languageId: string) => {
        set({ isLoading: true });
        try {
          const request: ChooseLanguageRequest = { languageId };
          const { data } = await axios.post<ChooseLanguageResponse>(
            languageUrls.chooseLanguage,
            request,
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          set({
            currentLanguage: get().languages.find((l) => l.languageId === data.languageId) || null,
            currentLanguageId: data.languageId
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getCurrentLanguage: async () => {
        set({ isLoading: true });

        try {
          const { data } = await axios.get<GetCurrentLanguageIdResponse>(
            languageUrls.getCurrentLanguageId,
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          set({
            currentLanguage: get().languages.find((l) => l.languageId === data.languageId) || null,
            currentLanguageId: data.languageId
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'languages'
    }
  )
);

import { create } from 'zustand';
import {
  ChooseLanguageRequest,
  ChooseLanguageResponse,
  GetLanguagesResponse,
  GetMyLanguageIdResponse,
  Language
} from './language.models.ts';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { languageUrls } from './languages.urls.ts';
import { createAuthHeader } from '../../helpers/authHelpers.ts';
import { useAuthStore } from '../auth/auth.store.ts';

interface LanguagesState {
  languages: Language[];
  isLoading: boolean;
  error: string | null;

  myLanguage: Language | null;

  getActiveLanguages: () => Promise<void>;
  chooseLanguage: (languageId: string) => Promise<void>;
  getMyLanguage: () => Promise<void>;
}

export const useLanguagesStore = create<LanguagesState>()(
  persist(
    (set, get) => ({
      languages: [],
      isLoading: false,
      error: null,

      myLanguage: null,

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
            myLanguage: get().languages.find((l) => l.languageId === data.languageId) || null
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getMyLanguage: async () => {
        set({ isLoading: true });

        try {
          const { data } = await axios.get<GetMyLanguageIdResponse>(
            languageUrls.getUserLanguageId,
            {
              headers: createAuthHeader(useAuthStore.getState().accessToken)
            }
          );

          console.log('have');
          const result = get().languages.find((l) => l.languageId === data.languageId) || null;
          console.log(result);

          set({
            myLanguage: get().languages.find((l) => l.languageId === data.languageId) || null
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

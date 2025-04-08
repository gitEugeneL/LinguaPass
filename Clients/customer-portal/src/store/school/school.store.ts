import { Country, GetCountriesResponse } from './school.models.ts';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { schoolUrls } from './school.urls.ts';
import { createAuthHeader } from '../../helpers/authHelpers.ts';
import { useAuthStore } from '../auth/auth.store.ts';

interface SchoolsState {
  countries: Country[];
  countriesLanguageId: string | null;

  isLoading: boolean;
  error: string | null;

  getCountries: (languageId: string) => Promise<void>;
}

export const useSchoolsStore = create<SchoolsState>()(
  persist(
    (set, get) => ({
      countries: [],
      countriesLanguageId: null,
      isLoading: false,
      error: null,

      getCountries: async (languageId: string) => {
        set({ isLoading: true, countriesLanguageId: null });
        try {
          const { data } = await axios.get<GetCountriesResponse>(schoolUrls.getCountries, {
            params: { languageId: languageId },
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });
          set({
            error: null,
            countries: data.items,
            countriesLanguageId: languageId
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
      name: 'schools'
    }
  )
);

import { Country, GetCountriesResponse, GetSchoolsResponse, School } from './school.models.ts';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { schoolUrls } from './school.urls.ts';
import { createAuthHeader } from '../../helpers/authHelpers.ts';
import { useAuthStore } from '../auth/auth.store.ts';

interface SchoolsState {
  countries: Country[];
  schools: School[];

  currentLanguageId: string | null;
  currentCountryId: string | null;
  isLoading: boolean;
  error: string | null;
  getCountries: (languageId: string) => Promise<void>;
  getSchools: (countryId: string) => Promise<void>;
}

export const useSchoolsStore = create<SchoolsState>()(
  persist(
    (set, get) => ({
      countries: [],
      schools: [],
      currentLanguageId: null,
      currentCountryId: null,
      isLoading: false,
      error: null,

      getCountries: async (languageId: string) => {
        set({ isLoading: true, currentLanguageId: null });
        try {
          const { data } = await axios.get<GetCountriesResponse>(schoolUrls.getCountries, {
            params: { languageId: languageId },
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });
          set({
            error: null,
            countries: data.items,
            currentLanguageId: languageId
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getSchools: async (countryId: string) => {
        set({ isLoading: true, currentCountryId: null, schools: [] });
        try {
          const { data } = await axios.get<GetSchoolsResponse>(schoolUrls.getSchools, {
            params: { countryId: countryId, languageId: get().currentLanguageId },
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });
          set({
            error: null,
            schools: data.items,
            currentCountryId: countryId
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

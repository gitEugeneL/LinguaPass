import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useAccountStore, useAuthStore } from '../index.ts';

import {
  type ChooseSchoolRequest,
  type ChooseSchoolResponse,
  type Country,
  type GetCountriesResponse,
  type GetSchoolById,
  type GetSchoolsResponse,
  type School
} from './school.models.ts';
import { schoolUrls } from './school.urls.ts';

interface SchoolsState {
  countries: Country[];
  schools: School[];

  currentSchool: School | null;

  chosenCountryId: string | null;
  chosenLanguageId: string | null;
  currentCountryId: string | null;

  isLoading: boolean;
  error: string | null;

  getCurrentSchool: (schoolId: string) => Promise<void>;
  getCountries: (languageId: string) => Promise<void>;
  getSchools: (languageId: string, countryId: string) => Promise<void>;
  chooseSchool: (languageId: string, schoolId: string, countryId: string) => Promise<void>;
}

export const useSchoolsStore = create<SchoolsState>()(
  persist(
    (set, get) => ({
      countries: [],
      schools: [],
      currentSchool: null,
      chosenLanguageId: null,
      chosenCountryId: null,
      currentCountryId: null,
      isLoading: false,
      error: null,

      getCountries: async (languageId: string) => {
        if (get().chosenLanguageId !== languageId) {
          set({ isLoading: true, currentSchool: null, schools: [] });
          try {
            const { data } = await axios.get<GetCountriesResponse>(
              schoolUrls.getCountries(languageId),
              { headers: createAuthHeader(useAuthStore.getState().accessToken) }
            );
            set({
              error: null,
              countries: data.items,
              chosenLanguageId: languageId,
              schools: [],
              chosenCountryId: null
            });
            useAccountStore.getState().updateLanguageId(languageId);
          } catch (error) {
            if (error instanceof AxiosError) {
              set({ error: error.response?.data });
            }
          } finally {
            set({ isLoading: false });
          }
        }
      },

      getSchools: async (languageId: string, countryId: string) => {
        if (get().chosenCountryId !== countryId || get().chosenLanguageId !== languageId) {
          set({ isLoading: true, schools: [] });
          try {
            const { data } = await axios.get<GetSchoolsResponse>(
              schoolUrls.getSchools(countryId, languageId),
              { headers: createAuthHeader(useAuthStore.getState().accessToken) }
            );
            set({
              error: null,
              schools: data.items,
              chosenCountryId: countryId
            });
          } catch (error) {
            if (error instanceof AxiosError) {
              set({ error: error.response?.data });
            }
          } finally {
            set({ isLoading: false });
          }
        }
      },

      chooseSchool: async (languageId: string, schoolId: string, countryId: string) => {
        set({ isLoading: true });
        try {
          const request: ChooseSchoolRequest = { schoolId: schoolId, languageId: languageId };
          const { data } = await axios.post<ChooseSchoolResponse>(
            schoolUrls.chooseSchool,
            request,
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          set({
            currentSchool: get().schools.find((s) => s.schoolId === data.schoolId) || null,
            currentCountryId: countryId
          });
          useAccountStore.getState().updateSchoolId(data.schoolId);
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getCurrentSchool: async (schoolId: string) => {
        set({ isLoading: true, currentSchool: null });
        try {
          const { data } = await axios.get<GetSchoolById>(schoolUrls.getSchoolById(schoolId), {
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });
          set({
            currentCountryId: data.countryId,
            currentSchool: {
              schoolId: data.schoolId,
              name: data.name,
              city: data.city,
              isActive: data.isActive,
              countryId: data.countryId
            }
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

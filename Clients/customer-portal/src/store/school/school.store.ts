import {
  ChooseSchoolRequest,
  ChooseSchoolResponse,
  Country,
  GetCountriesResponse,
  GetCurrentSchoolIdResponse,
  GetSchoolById,
  GetSchoolsResponse,
  School
} from './school.models.ts';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { createAuthHeader } from '../../helpers/authHelpers.ts';
import { useAuthStore } from '../auth/auth.store.ts';
import { schoolUrls } from './school.urls.ts';

interface SchoolsState {
  countries: Country[];
  schools: School[];

  currentSchool: School | null;

  currentLanguageId: string | null;
  currentCountryId: string | null;
  currentSchoolId: string | null;

  isLoading: boolean;
  error: string | null;

  getCurrentSchoolId: () => Promise<void>;
  getCurrentSchool: () => Promise<void>;
  getCountries: (languageId: string) => Promise<void>;
  getSchools: (countryId: string) => Promise<void>;
  chooseSchool: (schoolId: string, countryId: string) => Promise<void>;
}

export const useSchoolsStore = create<SchoolsState>()(
  persist(
    (set, get) => ({
      countries: [],
      schools: [],
      currentSchool: null,
      currentLanguageId: null,
      currentCountryId: null,
      currentSchoolId: null,
      isLoading: false,
      error: null,

      getCountries: async (languageId: string) => {
        set({ isLoading: true, currentLanguageId: null });
        try {
          const { data } = await axios.get<GetCountriesResponse>(
            schoolUrls.getCountries(languageId),
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
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
        set({ isLoading: true, schools: [] });

        try {
          const { data } = await axios.get<GetSchoolsResponse>(
            schoolUrls.getSchools(countryId, get().currentLanguageId!),
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          set({
            error: null,
            schools: data.items
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      chooseSchool: async (schoolId: string, countryId: string) => {
        set({ isLoading: true });
        try {
          const languageId = get().currentLanguageId;
          if (languageId) {
            const request: ChooseSchoolRequest = { schoolId: schoolId, languageId: languageId };

            const { data } = await axios.post<ChooseSchoolResponse>(
              schoolUrls.chooseSchool,
              request,
              { headers: createAuthHeader(useAuthStore.getState().accessToken) }
            );
            set({
              currentSchool: get().schools.find((s) => s.schoolId === data.schoolId) || null,
              currentSchoolId: data.schoolId,
              currentCountryId: countryId
            });
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getCurrentSchoolId: async () => {
        set({ isLoading: true, currentSchoolId: null });
        try {
          const { data } = await axios.get<GetCurrentSchoolIdResponse>(
            schoolUrls.getCurrentSchoolId,
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          set({
            currentSchoolId: data.schoolId
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getCurrentSchool: async () => {
        set({ isLoading: true, currentSchool: null });
        try {
          const schoolId = get().currentSchoolId;
          if (schoolId) {
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
          }
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

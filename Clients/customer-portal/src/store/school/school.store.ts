import {
  ChooseSchoolRequest,
  ChooseSchoolResponse,
  Country,
  GetCountriesResponse,
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
import { useAccountStore } from '../account/account.store.ts';

interface SchoolsState {
  countries: Country[];
  schools: School[];

  currentSchool: School | null;

  chosenCountryId: string | null;
  chosenLanguageId: string | null;
  currentCountryId: string | null;

  isLoading: boolean;
  error: string | null;

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
      chosenLanguageId: null,
      chosenCountryId: null,
      currentCountryId: null,
      isLoading: false,
      error: null,

      getCountries: async (languageId: string) => {
        if (get().chosenLanguageId !== languageId) {
          set({ isLoading: true });
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

      getSchools: async (countryId: string) => {
        const currentLanguageId = useAccountStore.getState().account?.languageId;
        if (get().chosenCountryId !== countryId || get().chosenLanguageId !== currentLanguageId) {
          set({ isLoading: true, schools: [] });
          try {
            const { data } = await axios.get<GetSchoolsResponse>(
              schoolUrls.getSchools(countryId, currentLanguageId!),
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

      chooseSchool: async (schoolId: string, countryId: string) => {
        set({ isLoading: true });
        try {
          const languageId = useAccountStore.getState().account?.languageId;
          if (languageId) {
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
          }
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
          const schoolId = useAccountStore.getState().account?.schoolId;
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

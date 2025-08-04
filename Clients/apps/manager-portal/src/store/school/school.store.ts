import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type { GetSchoolsResponse, SchoolResponse } from './school.models.ts';
import { schoolUrls } from './school.urls.ts';

interface SchoolState {
  schools: SchoolResponse[];
  currentSchool: null | SchoolResponse;
  isLoading: boolean;
  error: null | string;

  getSchoolsByCountryId: (countryId: string) => Promise<void>;
}

export const useSchoolStore = create<SchoolState>((set) => ({
  schools: [],
  currentSchool: null,
  isLoading: false,
  error: null,

  getSchoolsByCountryId: async (countryId: string) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get<GetSchoolsResponse>(
        schoolUrls.getSchoolsByCountryId(countryId),
        {
          headers: createAuthHeader(useAuthStore.getState().accessToken)
        }
      );
      set({ schools: data.items });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  }
}));

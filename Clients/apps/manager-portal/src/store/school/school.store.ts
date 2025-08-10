import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type {
  CreateSchoolRequest,
  GetPaginatedSchoolsResponse,
  GetSchoolByIdResponse,
  GetSchoolsResponse,
  SchoolResponse,
  UpdateSchoolRequest
} from './school.models.ts';
import { schoolUrls } from './school.urls.ts';

interface SchoolState {
  paginator: {
    totalItemsCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  } | null;

  schools: SchoolResponse[];
  currentSchool: null | SchoolResponse;
  isLoading: boolean;
  error: null | string;

  getAllSchools: (pageNumber?: number, pageSize?: number) => Promise<void>;
  getSchoolsByCountryId: (countryId: string) => Promise<void>;
  getSchoolById: (schoolId: string) => Promise<void>;
  createSchool: (school: CreateSchoolRequest) => Promise<void>;
  updateSchool: (school: UpdateSchoolRequest) => Promise<void>;
  resetError: () => void;
}

export const useSchoolStore = create<SchoolState>((set, get) => ({
  paginator: null,
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
  },

  getSchoolById: async (schoolId: string) => {
    set({ isLoading: true, currentSchool: null });
    try {
      const school = get().schools.find((s) => s.schoolId === schoolId);
      if (school) {
        set({ currentSchool: school });
      } else {
        const { data } = await axios.get<GetSchoolByIdResponse>(
          schoolUrls.getSchoolById(schoolId),
          { headers: createAuthHeader(useAuthStore.getState().accessToken) }
        );
        set({ currentSchool: data });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createSchool: async (school: CreateSchoolRequest) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post<SchoolResponse>(schoolUrls.createSchool, school, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      if (get().schools.length === 0) {
        await get().getSchoolsByCountryId(school.countryId);
      }
      set({ schools: [{ ...data }, ...get().schools] });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateSchool: async (school: UpdateSchoolRequest) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.patch<SchoolResponse>(schoolUrls.updateSchool, school, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      if (get().schools.length > 0) {
        set({
          schools: get().schools.map((response) =>
            response.schoolId === school.schoolId ? { ...data } : response
          )
        });
      } else {
        await get().getSchoolsByCountryId(school.countryId);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getAllSchools: async (pageNumber = 1, pageSize = 10) => {
    set({ isLoading: true, schools: [], paginator: null });
    try {
      const { data } = await axios.get<GetPaginatedSchoolsResponse>(schoolUrls.getAllSchools, {
        params: { pageNumber, pageSize },
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      set({
        schools: data.items,
        paginator: {
          totalItemsCount: data.totalItemsCount,
          pageNumber: data.pageNumber,
          pageSize: data.pageSize,
          totalPages: data.totalPages
        }
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },
  resetError: () => set({ error: null })
}));

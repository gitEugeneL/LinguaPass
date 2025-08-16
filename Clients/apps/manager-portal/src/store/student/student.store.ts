import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type {
  ChangeActiveRequest,
  DashboardResponse,
  FinalizeApplicationRequest,
  FinalizeApplicationResponse,
  GetStudentDetailResponse,
  GetStudentsResponse,
  StudentDetailResponse,
  StudentResponse
} from './student.models.ts';
import { studentUrls } from './student.urls.ts';

interface StudentStore {
  dashboard: DashboardResponse | null;
  paginator: {
    totalItemsCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  } | null;

  students: StudentResponse[];
  studentDetail: StudentDetailResponse | null;

  isLoading: boolean;
  error: null | string;

  getAllStudents: (isActive: boolean, pageNumber?: number, pageSize?: number) => Promise<void>;
  getStudentDetail: (studentId: string) => Promise<void>;
  toggleActive: (studentId: string, isActive: boolean) => Promise<void>;
  resetError: () => void;
  getDashboardData: () => Promise<void>;
  finalizeApplication: (
    studentId: string,
    isApplicationValid: boolean,
    message?: string | null
  ) => Promise<void>;
}

export const useStudentStore = create<StudentStore>((set, get) => ({
  dashboard: null,
  paginator: null,
  students: [],
  studentDetail: null,
  isLoading: false,
  error: null,

  getAllStudents: async (isActive, pageNumber = 1, pageSize = 10) => {
    set({ isLoading: true, students: [], paginator: null, studentDetail: null });
    try {
      const { data } = await axios.get<GetStudentsResponse>(studentUrls.getAllStudents, {
        params: { pageNumber, pageSize, isActive },
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      set({
        students: data.items,
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

  getStudentDetail: async (studentId) => {
    set({ isLoading: true });
    try {
      set({ studentDetail: null });
      const { data } = await axios.get<GetStudentDetailResponse>(
        studentUrls.getStudentDetail(studentId),
        { headers: createAuthHeader(useAuthStore.getState().accessToken) }
      );
      set({ studentDetail: data });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  finalizeApplication: async (studentId, isApplicationValid, message = null) => {
    set({ isLoading: true });
    try {
      const request: FinalizeApplicationRequest = {
        userId: studentId,
        isApplicationValid: isApplicationValid,
        message: message
      };
      await axios.patch<FinalizeApplicationResponse>(studentUrls.finalizeApplication, request, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  toggleActive: async (studentId, isActive) => {
    try {
      const request: ChangeActiveRequest = {
        isActive: isActive
      };
      await axios.patch(studentUrls.changeActive(studentId), request, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      await get().getStudentDetail(studentId);
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getDashboardData: async () => {
    set({ isLoading: true, dashboard: null });
    try {
      const { data } = await axios.get<DashboardResponse>(studentUrls.dashboard, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      set({ dashboard: data });
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

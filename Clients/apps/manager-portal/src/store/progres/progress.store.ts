import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type {
  EnhancedStatus,
  GetAllStatusesResponse,
  GetStudentStatusResponse
} from './progress.models.ts';
import { progressUrls } from './progress.urls.ts';

interface ProgressState {
  statuses: EnhancedStatus[];
  studentStatuses: EnhancedStatus[];
  isLoading: boolean;
  error: string | null;

  getAllStatuses: () => Promise<void>;
  getStudentStatus: (userId: string) => Promise<void>;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  statuses: [],
  studentStatuses: [],
  isLoading: false,
  error: null,

  getAllStatuses: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get<GetAllStatusesResponse>(progressUrls.getStatuses, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });

      set({
        statuses: data.submission.map((item) => ({
          ...item,
          status: 'not done'
        }))
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getStudentStatus: async (userId) => {
    set({ isLoading: true, studentStatuses: [] });
    try {
      if (get().statuses.length === 0) {
        await get().getAllStatuses();
      }
      const { data } = await axios.get<GetStudentStatusResponse>(
        progressUrls.getStudentStatus(userId),
        {
          headers: createAuthHeader(useAuthStore.getState().accessToken)
        }
      );

      const updatedStatuses: EnhancedStatus[] = get().statuses.map((status) => {
        if (status.order < data.order) {
          return { ...status, status: 'complete' };
        }
        if (status.order === data.order) {
          return { ...status, status: 'active' };
        }
        return { ...status, status: 'not done' };
      });
      set({ studentStatuses: updatedStatuses });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  }
}));

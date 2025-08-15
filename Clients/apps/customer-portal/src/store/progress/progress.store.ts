import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import {
  type EnhancedStatus,
  type GetAllStatusesResponse,
  type GetMyStatusResponse
} from './progress.models.ts';
import { progressUrls } from './progress.urls.ts';

interface ProgressState {
  statuses: EnhancedStatus[];
  isLoading: boolean;
  error: string | null;

  myStatusGroup: 'submission' | 'review';
  myStatus: EnhancedStatus | null;

  getAllStatuses: () => Promise<void>;
  getMyStatus: () => Promise<void>;
  changeStep: (order: number) => void;
  changeStatusGroup: (statusGroup: 'submission' | 'review') => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  statuses: [],
  isLoading: false,
  error: null,
  myStatusGroup: 'submission',
  myStatus: null,

  changeStatusGroup: (statusGroup: 'submission' | 'review') => {
    set({ myStatusGroup: statusGroup });
  },

  getAllStatuses: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await axios.get<GetAllStatusesResponse>(progressUrls.getStatuses, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      const statuses: EnhancedStatus[] = (
        get().myStatusGroup === 'submission' ? data.submission : data.review
      ).map((item) => ({
        ...item,
        status: 'not done'
      }));
      set({ statuses: statuses });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getMyStatus: async () => {
    set({ error: null });
    try {
      const { data } = await axios.get<GetMyStatusResponse>(progressUrls.getMyStatus, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });

      if (data.order > 6 && get().myStatusGroup === 'submission') {
        get().changeStatusGroup('review');
        await get().getAllStatuses();
      }
      const updatedStatuses: EnhancedStatus[] = get().statuses.map((status) => {
        if (status.order < data.order) {
          return { ...status, status: 'complete' };
        }
        if (status.order === data.order) {
          return { ...status, status: 'active' };
        }
        return { ...status, status: 'not done' };
      });

      set({
        myStatus: updatedStatuses.find((status) => status.status === 'active') || null,
        statuses: updatedStatuses
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  changeStep: (order: number) => {
    const updatedStatuses: EnhancedStatus[] = get().statuses.map((status) => {
      if (status.order === order) {
        return { ...status, status: 'active' };
      }
      if (status.order < order) {
        return { ...status, status: 'complete' };
      }
      return { ...status, status: 'not done' };
    });

    set({
      statuses: updatedStatuses,
      myStatus: updatedStatuses.find((status) => status.order === order) || null
    });
  }
}));

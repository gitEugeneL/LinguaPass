import {
  type EnhancedStatus,
  type GetAllStatusesResponse,
  type GetMyStatusResponse
} from './progress.models.ts';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { progressUrls } from './progress.urls.ts';
import { useAuthStore } from '../auth/auth.store.ts';
import { createAuthHeader } from '../../helpers/authHelpers.ts';

interface ProgressState {
  statuses: EnhancedStatus[];
  isLoading: boolean;
  error: string | null;

  myStatusGroup: 'submission' | 'review';
  myStatus: EnhancedStatus | null;

  getAllStatuses: () => Promise<void>;
  getMyStatus: () => Promise<void>;
  changeStep: (order: number) => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      statuses: [],
      isLoading: false,
      error: null,
      myStatusGroup: 'submission',
      myStatus: null,

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
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.get<GetMyStatusResponse>(progressUrls.getMyStatus, {
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });

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
    }),
    {
      name: 'progress'
    }
  )
);

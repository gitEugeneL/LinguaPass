import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import { storageUrls } from './document.urls.ts';
import type { GetFIleNames } from './documet.module.ts';

interface DocumentState {
  fileNames: string[];
  isLoading: boolean;
  error: string | null;

  getFileNames: (userId: string) => Promise<void>;
  openFile: (userId: string, fileName: string) => Promise<void>;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  fileNames: [],
  isLoading: false,
  error: null,

  getFileNames: async (userId) => {
    set({ isLoading: true, fileNames: [] });
    try {
      const { data } = await axios.get<GetFIleNames>(storageUrls.getFileNames(userId), {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      set({ fileNames: data.fileNames });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  openFile: async (userId, fileName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(storageUrls.downloadFile(userId, fileName), {
        headers: createAuthHeader(useAuthStore.getState().accessToken),
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );
      window.open(url, '_blank');
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      if (error instanceof AxiosError) {
        set({
          error: error.response?.status === 404 ? 'File not found' : 'Error opening PDF'
        });
      } else {
        set({ error: 'Unexpected error occurred' });
      }
    } finally {
      set({ isLoading: false });
    }
  }
}));

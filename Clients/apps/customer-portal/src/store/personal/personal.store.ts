import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createAuthHeader } from '../../helpers';
import { useAccountStore, useAuthStore } from '../index.ts';

import {
  type CreatePersonalResponse,
  type GetCurrentPersonalResponse,
  type Personal
} from './personal.models.ts';
import { personalUrls } from './personal.urls.ts';

interface PersonalState {
  personal: Personal | null;
  currentPersonalId: string | null;

  isLoading: boolean;
  error: string | null;

  getCurrentPersonal: () => Promise<void>;
  createPersonal: (personal: Personal) => Promise<void>;
}

export const usePersonalStore = create<PersonalState>()(
  persist(
    (set) => ({
      personal: null,
      currentPersonalId: null,
      isLoading: false,
      error: null,

      createPersonal: async (personal: Personal) => {
        set({ isLoading: true });
        try {
          const { data } = await axios.post<CreatePersonalResponse>(
            personalUrls.createPersonal,
            personal,
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          set({
            currentPersonalId: data.personalId,
            personal: personal
          });
          useAccountStore.getState().updatePersonalId(data.personalId);
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getCurrentPersonal: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axios.get<GetCurrentPersonalResponse>(
            personalUrls.getCurrentPersonal,
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          const { personalId, birthday, ...personalData } = data;

          const personal: Personal = {
            ...personalData,
            birthday: new Date(birthday)
          };
          set({
            currentPersonalId: personalId,
            personal: personal
          });
          useAccountStore.getState().updatePersonalId(personalId);
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
      name: 'personal',
      partialize: (state: PersonalState) => ({
        currentPersonalId: state.currentPersonalId
      })
    }
  )
);

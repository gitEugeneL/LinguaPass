import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { useAuthStore } from '../index.ts';

import {
  type Account,
  type GetCurrentAccount,
  type GetShortUserInfoResponse,
  type SendApplicationResponse,
  type UserData
} from './account.models.ts';
import { accountUrls } from './account.urls.ts';

interface AccountState {
  account: Account | null;
  userData: UserData | null;

  isLoading: boolean;
  error: string | null;

  getCurrentAccount: () => Promise<void>;
  getShortUserInfo: () => Promise<void>;

  updateAccount: <K extends keyof Account>(key: K, value: Account[K]) => void;
  updateLanguageId: (languageId: string) => void;
  updateSchoolId: (schoolId: string) => void;
  updateCourseId: (courseId: string) => void;
  updateContactId: (contactId: string) => void;
  updatePersonalId: (personalId: string) => void;

  resetApplication: () => Promise<void>;
  sendApplication: () => Promise<void>;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      account: null,
      userData: null,
      isLoading: false,
      error: null,

      getCurrentAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.get<GetCurrentAccount>(accountUrls.getCurrentAccount, {
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });
          set({
            account: {
              userId: data.userId,
              languageId: data.languageId,
              schoolId: data.schoolId,
              courseId: data.courseId,
              contactId: data.contactId,
              personalId: data.personalId,
              documentsId: data.documentsId,
              isApplicationComplete: data.isApplicationComplete,
              applicationNote: data.applicationNote
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

      getShortUserInfo: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axios.get<GetShortUserInfoResponse>(accountUrls.getShortUserInfo, {
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });
          set({
            userData: {
              name: data.name,
              surname: data.surname
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

      updateAccount: <K extends keyof Account>(key: K, value: Account[K]) => {
        set((state: AccountState) => ({
          account: state.account ? { ...state.account, [key]: value } : state.account
        }));
      },

      updateLanguageId: (languageId: string) => get().updateAccount('languageId', languageId),
      updateSchoolId: (schoolId: string) => get().updateAccount('schoolId', schoolId),
      updateCourseId: (courseId: string) => get().updateAccount('courseId', courseId),

      updateContactId: (contactId: string) => {
        set((state) => ({
          account: state.account ? { ...state.account, contactId } : null
        }));
      },

      updatePersonalId: (personalId: string) => {
        set((state) => ({
          account: state.account ? { ...state.account, personalId } : null
        }));
      },

      sendApplication: async () => {
        set({ isLoading: true });
        try {
          await axios.patch<SendApplicationResponse>(
            accountUrls.sendApplication,
            {},
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
            throw error;
          }
        } finally {
          set({ isLoading: false });
        }
      },

      resetApplication: async () => {
        set({ isLoading: true });
        try {
          await axios.get(accountUrls.resetApplication, {
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
            throw error;
          }
        } finally {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'account'
    }
  )
);

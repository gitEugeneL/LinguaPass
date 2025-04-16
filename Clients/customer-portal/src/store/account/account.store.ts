import { Account, GetCurrentAccount } from './account.models.ts';
import { persist } from 'zustand/middleware';
import { create } from 'zustand';
import axios, { AxiosError } from 'axios';
import { accountUrls } from './account.urls.ts';
import { createAuthHeader } from '../../helpers/authHelpers.ts';
import { useAuthStore } from '../auth/auth.store.ts';

interface AccountState {
  account: Account | null;

  isLoading: boolean;
  error: string | null;

  getCurrentAccount: () => Promise<void>;

  updateAccount: <K extends keyof Account>(key: K, value: Account[K]) => void;
  updateLanguageId: (languageId: string) => void;
  updateSchoolId: (schoolId: string) => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set, get) => ({
      account: null,
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
              courseId: data.courseId
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
      updateSchoolId: (schoolId: string) => get().updateAccount('schoolId', schoolId)
    }),
    {
      name: 'account'
    }
  )
);

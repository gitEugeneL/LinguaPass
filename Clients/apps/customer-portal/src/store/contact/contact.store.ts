import {
  type Contact,
  type CreateContactResponse,
  type GetCurrentContactResponse
} from './contact.models.ts';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';
import { contactUrls } from './contact.urls.ts';
import { createAuthHeader } from '../../helpers/authHelpers.ts';
import { useAuthStore } from '../auth/auth.store.ts';
import { useAccountStore } from '../account/account.store.ts';

interface ContactState {
  contact: Contact | null;
  currentContactId: string | null;

  isLoading: boolean;
  error: string | null;

  getCurrentContact: () => Promise<void>;
  createContact: (contact: Contact) => Promise<void>;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set) => ({
      contact: null,
      currentContactId: null,
      isLoading: false,
      error: null,

      createContact: async (contact: Contact) => {
        set({ isLoading: true });
        try {
          const { data } = await axios.post<CreateContactResponse>(
            contactUrls.createContact,
            contact,
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          set({
            currentContactId: data.contactId,
            contact: contact
          });
          useAccountStore.getState().updateContactId(data.contactId);
        } catch (error) {
          if (error instanceof AxiosError) {
            set({ error: error.response?.data });
          }
        } finally {
          set({ isLoading: false });
        }
      },

      getCurrentContact: async () => {
        set({ isLoading: true });
        try {
          const { data } = await axios.get<GetCurrentContactResponse>(
            contactUrls.getCurrentContact,
            { headers: createAuthHeader(useAuthStore.getState().accessToken) }
          );
          const { contactId, ...contact } = data;
          set({
            currentContactId: contactId,
            contact: contact
          });
          useAccountStore.getState().updateContactId(contactId);
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
      name: 'contact',
      partialize: (state: ContactState) => ({
        currentContactId: state.currentContactId
      })
    }
  )
);

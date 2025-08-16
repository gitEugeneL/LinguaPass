import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type {
  Country,
  CountryResponse,
  CreateUpdateCountryResponse,
  GetCountriesResponse,
  GetCountryByIdResponse,
  UpdateCountryRequest
} from './country.models.ts';
import { countryUrls } from './country.urls.ts';

interface CountryState {
  countries: CountryResponse[];
  currentCountry: null | CountryResponse;
  isLoading: boolean;
  error: null | string;

  getAllCountries: () => Promise<void>;
  getCountryById: (countryId: string) => Promise<void>;
  createCountry: (country: Country) => Promise<void>;
  updateCountry: (country: UpdateCountryRequest) => Promise<void>;
  toggleActive: (countryId: string, isActive: boolean) => Promise<void>;
  deleteCountry: (countryId: string) => Promise<void>;
  resetError: () => void;
}

export const useCountryStore = create<CountryState>((set, get) => ({
  countries: [],
  currentCountry: null,
  isLoading: false,
  error: null,

  getAllCountries: async () => {
    set({ isLoading: true });
    try {
      const { data } = await axios.get<GetCountriesResponse>(countryUrls.getAllCountries, {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      set({ countries: data.items });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  getCountryById: async (countryId: string) => {
    set({ isLoading: true, currentCountry: null });
    try {
      const country = get().countries.find((c) => c.countryId === countryId);
      if (country) {
        set({ currentCountry: country });
      } else {
        const { data } = await axios.get<GetCountryByIdResponse>(
          countryUrls.getCountryById(countryId),
          { headers: createAuthHeader(useAuthStore.getState().accessToken) }
        );
        set({ currentCountry: data });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createCountry: async (country: Country) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.post<CreateUpdateCountryResponse>(
        countryUrls.createCountry,
        country,
        {
          headers: createAuthHeader(useAuthStore.getState().accessToken)
        }
      );
      if (get().countries.length === 0) {
        await get().getAllCountries();
      }
      set({ countries: [{ ...data }, ...get().countries] });
    } catch (error) {
      if (error instanceof AxiosError) {
        set({ error: error.response?.data });
        throw error;
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateCountry: async (country: UpdateCountryRequest) => {
    set({ isLoading: true });
    try {
      const { data } = await axios.patch<CreateUpdateCountryResponse>(
        countryUrls.updateCountry,
        country,
        { headers: createAuthHeader(useAuthStore.getState().accessToken) }
      );
      if (get().countries.length > 0) {
        set({
          countries: get().countries.map((response) =>
            response.countryId === country.countryId ? { ...data } : response
          )
        });
      } else {
        await get().getAllCountries();
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

  toggleActive: async (countryId, isActive) => {
    set({ isLoading: true });
    const request: UpdateCountryRequest = {
      countryId: countryId,
      isActive: isActive
    };
    try {
      const { data } = await axios.patch<CreateUpdateCountryResponse>(
        countryUrls.updateCountry,
        request,
        { headers: createAuthHeader(useAuthStore.getState().accessToken) }
      );
      if (get().countries.length > 0) {
        set({
          countries: get().countries.map((response) =>
            response.countryId === request.countryId ? { ...data } : response
          )
        });
      } else {
        await get().getAllCountries();
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

  deleteCountry: async (countryId) => {
    set({ isLoading: true });
    try {
      await axios.delete(countryUrls.deleteCountry(countryId), {
        headers: createAuthHeader(useAuthStore.getState().accessToken)
      });
      if (get().countries.length > 0) {
        set({
          countries: get().countries.filter((country) => country.countryId !== countryId)
        });
      } else {
        await get().getAllCountries();
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

  resetError: () => set({ error: null })
}));

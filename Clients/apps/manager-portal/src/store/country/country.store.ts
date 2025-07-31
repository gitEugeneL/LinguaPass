import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type { Country, GetCountriesResponse, GetCountryByIdResponse } from './country.models.ts';
import { countryUrls } from './country.urls.ts';

interface CountryState {
  countries: Country[];
  currentCountry: null | Country;
  isLoading: boolean;
  error: null | string;

  getAllCountries: () => Promise<void>;
  getCountryById: (countryId: string) => Promise<void>;
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
  }
}));

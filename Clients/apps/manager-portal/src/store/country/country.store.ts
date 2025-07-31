import { createAuthHeader } from '@clients/shared';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import { useAuthStore } from '../index.ts';

import type { Country, GetCountriesResponse } from './country.models.ts';
import { countryUrls } from './country.urls.ts';

interface CountryState {
  countries: Country[];
  isLoading: boolean;
  error: null | string;

  getAllCountries: () => Promise<void>;
}

export const useCountryStore = create<CountryState>((set) => ({
  countries: [],
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
  }
}));

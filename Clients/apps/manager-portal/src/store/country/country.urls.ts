import { COURSE } from '@clients/shared';

export const countryUrls = {
  getAllCountries: `${COURSE}/countries`,

  getCountryById: (countryId: string) => `${COURSE}/countries/${countryId}`
};

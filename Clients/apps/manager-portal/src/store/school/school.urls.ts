import { COURSE } from '@clients/shared';

export const schoolUrls = {
  getSchoolsByCountryId: (countryId: string) => `${COURSE}/schools/country/${countryId}`
};

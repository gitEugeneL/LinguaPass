import { COURSE } from '@clients/shared';

export const schoolUrls = {
  getAllSchools: `${COURSE}/schools`,

  getSchoolsByCountryId: (countryId: string) => `${COURSE}/schools/country/${countryId}`,

  getSchoolById: (schoolId: string) => `${COURSE}/schools/${schoolId}`,

  createSchool: `${COURSE}/schools`,

  updateSchool: `${COURSE}/schools`,

  deleteSchool: (schoolId: string) => `${COURSE}/schools/${schoolId}`
};

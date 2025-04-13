import { ACCOUNT, COURSE } from '../../helpers/api.tsx';

export const schoolUrls = {
  getCountries: (languageId: string) => `${COURSE}/countries/language/${languageId}`,

  getSchools: (countryId: string, languageId: string) =>
    `${COURSE}/schools/country/${countryId}/language/${languageId}`,

  getCourses: `${COURSE}/courses`,

  chooseSchool: `${ACCOUNT}/choose-school`,

  getCurrentSchoolId: `${ACCOUNT}/my-schoolId`,

  getSchoolById: (schoolId: string) => `${COURSE}/schools/${schoolId}`
};

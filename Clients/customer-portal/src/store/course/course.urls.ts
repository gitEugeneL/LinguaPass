import { COURSE } from '../../helpers/api.tsx';

export const courseUrls = {
  getCourses: (schoolId: string, languageId: string) =>
    `${COURSE}/school/${schoolId}/language/${languageId}`
};

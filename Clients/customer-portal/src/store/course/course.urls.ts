import { ACCOUNT, COURSE } from '../../helpers/api.tsx';

export const courseUrls = {
  getCourses: (schoolId: string, languageId: string) => {
    return `${COURSE}/school/${schoolId}/language/${languageId}`;
  },

  chooseCourse: `${ACCOUNT}/choose-course`
};

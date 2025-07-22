import { ACCOUNT, COURSE } from '../../helpers/api.tsx';

export const courseUrls = {
  getCourses: (schoolId: string, languageId: string) => {
    return `${COURSE}/school/${schoolId}/language/${languageId}`;
  },

  getCourseById: (courseId: string) => `${COURSE}/courses/${courseId}`,

  chooseCourse: `${ACCOUNT}/choose-course`
};

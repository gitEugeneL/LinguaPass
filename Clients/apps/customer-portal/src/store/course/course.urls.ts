import { ACCOUNT, COURSE } from '@clients/shared';

export const courseUrls = {
  getCourses: (schoolId: string, languageId: string) => {
    return `${COURSE}/school/${schoolId}/language/${languageId}`;
  },

  getCourseById: (courseId: string) => `${COURSE}/courses/${courseId}`,

  chooseCourse: `${ACCOUNT}/choose-course`
};

import { COURSE } from '@clients/shared';

export const courseUrls = {
  getCoursesBySchoolId: (schoolId: string) => `${COURSE}/courses/school/${schoolId}`,

  getCourseById: (courseId: string) => `${COURSE}/courses/${courseId}`,

  createCourse: `${COURSE}/courses`,

  updateCourse: `${COURSE}/courses`
};

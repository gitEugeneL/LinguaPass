import { COURSE } from '@clients/shared';

export const courseUrls = {
  getAllCourses: `${COURSE}/courses`,

  getCoursesBySchoolId: (schoolId: string) => `${COURSE}/courses/school/${schoolId}`,

  getCourseById: (courseId: string) => `${COURSE}/courses/${courseId}`,

  createCourse: `${COURSE}/courses`,

  updateCourse: `${COURSE}/courses`,

  deleteCourse: (courseId: string) => `${COURSE}/courses/${courseId}`,

  dashboard: `${COURSE}/dashboard`
};

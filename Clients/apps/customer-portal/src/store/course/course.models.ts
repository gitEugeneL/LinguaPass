export interface Course {
  courseId: string;
  name: string;
  description: string;
  activities: string;
  duration: string;
  price: number;
  location: string;
  languageName: string;
  schoolName: string;
  admissionFee: number;
  withAccommodation: boolean;
  schoolId: string;
  languageId: string;
  isActive: boolean;
}

export type GetCourseById = Course;

export interface GetCoursesResponse {
  items: Course[];
}

export interface ChooseCourseRequest {
  languageId: string;
  schoolId: string;
  courseId: string;
}

export interface ChooseCourseResponse {
  userId: string;
  courseId: string;
}

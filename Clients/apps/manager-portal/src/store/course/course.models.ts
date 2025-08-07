export interface Course {
  name: string;
  description: string;
  activities: boolean;
  duration: string;
  price: number;
  admissionFee: number;
  isActive: boolean;
  withAccommodation: boolean;
}

export interface CourseResponse extends Course {
  courseId: string;
  location: string;
  languageId: string;
  languageName: string;
  countryName: string;
  schoolName: string;
  schoolId: string;
}

export interface CreateCourseRequest extends Course {
  schoolId: string;
  languageId: string;
}

export interface GetCoursesResponse {
  items: CourseResponse[];
}

export type GetCourseByIdResponse = CourseResponse;

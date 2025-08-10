export interface Course {
  name: string;
  description: string;
  activities: string;
  duration: string;
  price: string;
  admissionFee: string;
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

export interface UpdateCourseRequest {
  courseId: string;
  schoolId: string;
  name?: string | null;
  description?: string | null;
  activities?: string | null;
  duration?: string | null;
  price?: string | null;
  admissionFee?: string | null;
  isActive?: boolean | null;
  withAccommodation?: boolean | null;
  languageId?: string | null;
}

export interface GetCoursesResponse {
  items: CourseResponse[];
}

export type GetCourseByIdResponse = CourseResponse;

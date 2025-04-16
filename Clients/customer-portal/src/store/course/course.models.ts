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

export interface GetCoursesResponse {
  items: Course[];
}

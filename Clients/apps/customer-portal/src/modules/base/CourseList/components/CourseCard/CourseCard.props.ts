export interface CourseCardProps {
  name: string;
  languageName: string;
  schoolName: string;
  description: string;
  activities: string;
  location: string;
  price: number;
  admissionFee: number;
  withAccommodation: boolean;
  duration: string;
  courseId: string;
  isLoading: boolean;
  isBlocked: boolean;
  handleChoose: (courseId: string) => void;
  chosen?: boolean;
}

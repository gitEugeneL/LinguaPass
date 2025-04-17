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
  handleChoose: (courseId: string) => void;
}

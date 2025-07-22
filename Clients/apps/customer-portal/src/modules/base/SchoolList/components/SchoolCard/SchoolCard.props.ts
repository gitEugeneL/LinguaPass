export interface SchoolCardProps {
  name: string;
  city: string;
  schoolId: string;
  countryId: string;
  currentSchoolId: string | null;
  handleChoose: (schoolId: string, countryId: string) => void;
  updatedStatus: boolean;
}

export interface SchoolWidgetProps {
  countryId: string;
  name: string;
  schoolsCount: number;
  isOpened: boolean;
  onClick: (countryId: string) => void;
  handleChoose: (schoolId: string, countryId: string) => void;
  updateStatus: boolean;
}

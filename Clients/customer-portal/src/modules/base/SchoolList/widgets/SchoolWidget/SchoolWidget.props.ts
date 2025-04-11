export interface SchoolWidgetProps {
  countryId: string;
  name: string;
  schoolsCount: number;
  isOpened: boolean;
  onClick: (countryId: string) => void;
}

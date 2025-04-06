export interface LanguageCardProps {
  title: string;
  description: string;
  handleClick: () => void;
  isLoading: boolean;
  chosen?: boolean;
}

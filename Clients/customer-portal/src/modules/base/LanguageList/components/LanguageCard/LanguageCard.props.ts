export interface LanguageCardProps {
  title: string;
  description: string;
  handleChoose: () => void;
  isLoading: boolean;
  chosen?: boolean;
}

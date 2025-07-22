export interface DangerCardProps {
  title: string;
  description: string;
  btn1Text: string;
  btn2Text: string;
  btn1Action: () => void;
  btn2Action: () => void;
  btn1IsLoading?: boolean;
  btn2IsLoading?: boolean;
}

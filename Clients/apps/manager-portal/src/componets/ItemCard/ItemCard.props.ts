export interface ItemCardProps {
  name: string;
  isActiveStatus: boolean;
  elemCount: number;
  btn1Action?: () => void;
  btn2Action?: () => void;
}

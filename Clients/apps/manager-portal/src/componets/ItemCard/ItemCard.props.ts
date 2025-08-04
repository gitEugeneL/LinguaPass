export interface ItemCardProps {
  itemId: string;
  name: string;
  isActiveStatus: boolean;
  elemCount: number;
  btn1Action?: () => void;
  btn2Action?: () => void;

  appearance: 'country' | 'school' | 'course';
  country?: string | null;
  city?: string | null;

  languages?: string[] | null;
}

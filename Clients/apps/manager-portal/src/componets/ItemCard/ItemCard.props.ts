export interface ItemCardProps {
  itemId: string;
  name: string;
  isActiveStatus: boolean;
  elemCount?: number | null;
  btn1Action?: () => void;
  btn2Action?: () => void;

  appearance: 'country' | 'school' | 'course';
  parentId?: string | null;
  parentName?: string | null;
  country?: string | null;
  city?: string | null;
  languages?: string[] | null;
}

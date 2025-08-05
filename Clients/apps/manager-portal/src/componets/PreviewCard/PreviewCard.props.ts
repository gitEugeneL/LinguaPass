export interface PreviewCardProps {
  name: string;
  isActiveStatus: boolean;
  isCreate: boolean;
  count?: number | null;
  appearance: 'country' | 'school';
  shortName?: string | null;
  city?: string | null;
  country?: string | undefined;
  languages?: string[] | null;
}

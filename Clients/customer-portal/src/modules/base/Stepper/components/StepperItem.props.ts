export interface StepperItemProps {
  status: 'complete' | 'active' | 'not done';
  name: string;
  isFirst?: boolean;
  isLast?: boolean;
}

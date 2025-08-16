import { type EnhancedStatus } from '../../../../../apps/customer-portal/src/store/progress/progress.models.ts';

export interface StepperProps {
  isLoading: boolean;
  statuses: EnhancedStatus[];
  size?: 'small' | 'normal';
}

import { type EnhancedStatus } from '../../../store/progress/progress.models.ts';

export interface StepperProps {
  isLoading: boolean;
  statuses: EnhancedStatus[];
}

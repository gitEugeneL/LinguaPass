import type { Control, FieldErrors, FieldValues } from 'react-hook-form';

export interface LanguageFieldsetProps {
  label: string;
  name: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
  options: { value: string; label: string }[];
}

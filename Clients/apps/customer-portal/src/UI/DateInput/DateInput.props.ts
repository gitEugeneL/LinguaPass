import { type Control, type FieldErrors, type FieldValues } from 'react-hook-form';

export interface DateInputProps {
  name: string;
  label: string;
  placeholder: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
}

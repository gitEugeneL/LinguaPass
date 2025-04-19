import { InputHTMLAttributes } from 'react';
import { Control, FieldErrors, FieldValues, UseFormResetField } from 'react-hook-form';

export interface OptionalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checkboxLabel: string;
  name: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
  resetField: UseFormResetField<any>;
}

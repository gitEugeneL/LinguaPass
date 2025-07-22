import { InputHTMLAttributes } from 'react';
import { Control, FieldErrors, FieldValues } from 'react-hook-form';

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  disabled?: boolean;
  name: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
}

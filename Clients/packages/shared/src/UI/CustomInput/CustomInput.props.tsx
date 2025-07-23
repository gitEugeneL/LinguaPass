import { type InputHTMLAttributes } from 'react';
import { type Control, type FieldErrors, type FieldValues } from 'react-hook-form';

export interface CustomInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  disabled?: boolean;
  name: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
}

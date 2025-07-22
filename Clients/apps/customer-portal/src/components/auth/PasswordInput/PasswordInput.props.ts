import { type InputHTMLAttributes } from 'react';
import { type Control, type FieldErrors, type FieldValues } from 'react-hook-form';

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
}

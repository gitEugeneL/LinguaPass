import { type InputHTMLAttributes } from 'react';
import { type Control, type FieldErrors, type FieldValues } from 'react-hook-form';

export interface CodeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
}

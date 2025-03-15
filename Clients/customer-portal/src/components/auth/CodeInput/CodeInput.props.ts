import { InputHTMLAttributes } from 'react';
import { Control, FieldErrors, FieldValues } from 'react-hook-form';

export interface CodeInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
}

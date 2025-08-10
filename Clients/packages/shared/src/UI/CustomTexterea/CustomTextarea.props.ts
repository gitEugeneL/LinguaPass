import { type TextareaHTMLAttributes } from 'react';
import { type Control, type FieldErrors, type FieldValues } from 'react-hook-form';

export interface CustomTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  disabled?: boolean;
  name: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
  maxSize: number;
}

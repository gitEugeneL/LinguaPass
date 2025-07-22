import { type Dispatch, type InputHTMLAttributes, type SetStateAction } from 'react';
import {
  type Control,
  type FieldErrors,
  type FieldValues,
  type UseFormSetValue
} from 'react-hook-form';

export interface OptionalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  checkboxLabel: string;
  name: string;
  control: Control<any>;
  errors: FieldErrors<FieldValues>;
  setValue: UseFormSetValue<any>;
  isInputEnabled: boolean;
  setInputEnabled: Dispatch<SetStateAction<boolean>>;
}

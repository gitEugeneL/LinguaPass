import { Control } from 'react-hook-form';

export interface CustomSelectProps {
  label?: string;
  name: string;
  control: Control<any>;
  options: { value: string; label: string }[];
}

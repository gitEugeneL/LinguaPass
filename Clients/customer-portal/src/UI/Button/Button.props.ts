import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  appearance?: 'primary' | 'secondary' | 'special' | 'danger' | 'disabled';
  size?: 'normal' | 'large';
  isLoading?: boolean;
}

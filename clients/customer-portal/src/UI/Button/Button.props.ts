import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  appearance?: 'primary' | 'secondary' | 'special' | 'danger' | 'secondaryDanger' | 'disabled';
  size?: 'small' | 'normal' | 'large';
  isLoading?: boolean;
}

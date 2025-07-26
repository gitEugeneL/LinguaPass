import type { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  appearance?:
    | 'primary'
    | 'secondary'
    | 'special'
    | 'specialSecondary'
    | 'danger'
    | 'secondaryDanger'
    | 'disabled';
  size?: 'small' | 'normal' | 'large';
  isLoading?: boolean;
}

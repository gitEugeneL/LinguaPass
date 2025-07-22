import { type ButtonHTMLAttributes } from 'react';

export interface MenuButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  toggleDrawer: () => void;
}

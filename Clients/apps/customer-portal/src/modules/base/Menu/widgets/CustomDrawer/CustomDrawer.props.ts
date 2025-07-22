import { type ReactNode } from 'react';

export interface CustomDrawerProps {
  toggleDrawer: () => void;
  isDrawerOpened: boolean;
  children?: ReactNode;
}

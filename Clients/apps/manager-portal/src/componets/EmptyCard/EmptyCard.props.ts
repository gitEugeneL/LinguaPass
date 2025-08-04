import type { MouseEventHandler } from 'react';

export interface EmptyCardProps {
  name: string;
  appearance: 'small' | 'big';
  onClick?: MouseEventHandler<HTMLDivElement>;
}

import type { MouseEventHandler } from 'react';

export interface EmptyCardProps {
  name: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

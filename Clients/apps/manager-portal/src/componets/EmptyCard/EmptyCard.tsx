import cn from 'classnames';

import styles from './EmptyCard.module.pcss';
import type { EmptyCardProps } from './EmptyCard.props.ts';
import { EmptyItemIcon } from './icons/EmptyItemIcon.tsx';

export function EmptyCard({ ...props }: EmptyCardProps) {
  return (
    <div
      className={cn(styles.card, {
        [styles.small]: props.appearance === 'small',
        [styles.big]: props.appearance === 'big'
      })}
      onClick={props.onClick}
    >
      <EmptyItemIcon />
      <span>{props.name}</span>
    </div>
  );
}

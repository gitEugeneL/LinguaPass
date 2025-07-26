import styles from './EmptyCard.module.pcss';
import type { EmptyCardProps } from './EmptyCard.props.ts';
import { EmptyItemIcon } from './icons/EmptyItemIcon.tsx';

export function EmptyCard({ ...props }: EmptyCardProps) {
  return (
    <div className={styles.card} onClick={props.onClick}>
      <EmptyItemIcon />
      <span>{props.name}</span>
    </div>
  );
}

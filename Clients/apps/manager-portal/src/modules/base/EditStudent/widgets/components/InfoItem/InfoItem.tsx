import styles from './InfoItem.module.pcss';
import type { InfoItemProps } from './InfoItem.props.ts';

export function InfoItem({ ...props }: InfoItemProps) {
  return (
    <li className={styles.container}>
      <span className={styles.key}>{props.title}</span>
      <span className={styles.value}>
        {props.value
          ? props.value.length <= 25
            ? props.value
            : props.value.slice(0, 25) + '...'
          : '-'}
      </span>
    </li>
  );
}

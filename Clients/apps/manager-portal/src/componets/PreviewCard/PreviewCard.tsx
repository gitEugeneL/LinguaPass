import { Status } from '../../UI';

import styles from './PreviewCard.module.pcss';
import type { PreviewCardProps } from './PreviewCard.props.ts';

export function PreviewCard({ count = 0, ...props }: PreviewCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.wrapper}>
        <div className={styles.statusWrapper}>
          <Status isActive={props.isActiveStatus} create={props.isCreate} />
          <span className={styles.preview}>preview</span>
        </div>
        <h3 className={styles.name}>{props.name ? props.name : '-'}</h3>
        <span className={styles.count}>Schools: {count}</span>
      </div>
    </div>
  );
}

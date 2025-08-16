import { LoaderIndicator } from '@clients/shared';

import type { MiniDashboardProps } from './MiniDashboard.props.ts';
import styles from './MiniDashboardCard.module.pcss';

export function MiniDashboardCard({ ...props }: MiniDashboardProps) {
  return (
    <div className={styles.card}>
      {props.isLoading && <LoaderIndicator color='secondary' height={64} />}

      {!props.isLoading && (
        <>
          <h3 className={styles.value}>{props.value}</h3>
          <span className={styles.key}>{props.subName}</span>
        </>
      )}
    </div>
  );
}

import { Outlet } from 'react-router';

import styles from './AuthLayout.module.pcss';

export function AuthLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

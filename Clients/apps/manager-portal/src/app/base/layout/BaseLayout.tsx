import { Outlet } from 'react-router';

import { PhoneCard } from '../../../componets';
import { Menu } from '../../../modules/base';

import styles from './BaseLayout.module.pcss';

export function BaseLayout() {
  return (
    <>
      <div className={styles.phoneWrapper}>
        <PhoneCard />
      </div>
      <div className={styles.container}>
        <Menu />
        <div className={styles.body}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

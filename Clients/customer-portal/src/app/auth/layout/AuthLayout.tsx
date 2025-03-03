import { Outlet } from 'react-router';
import { AuthBanner } from './icons/AuthBanner.tsx';
import styles from './AuthLayout.module.pcss';

export default function AuthLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.presentationWrapper}>
          LOGO
          <AuthBanner />
        </div>
        <div className={styles.separator} />
        <div className={styles.contentWrapper}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

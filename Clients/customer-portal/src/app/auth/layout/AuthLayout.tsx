import { Navigate, Outlet } from 'react-router';
import { AuthBanner } from './icons/AuthBanner.tsx';
import styles from './AuthLayout.module.pcss';
import { useAuthStore } from '../../../store/auth/auth.store.ts';

export default function AuthLayout() {
  const refreshTokenExpires = useAuthStore((state) => state.refreshTokenExpires);

  if (refreshTokenExpires) {
    return <Navigate to='/' />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.presentationWrapper}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>LinguaPass</h1>
            <p className={styles.description}>We Make Your Dreams Come True</p>
          </div>
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

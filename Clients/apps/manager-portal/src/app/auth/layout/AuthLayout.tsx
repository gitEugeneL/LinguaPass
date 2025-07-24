import { Navigate, Outlet } from 'react-router';

import { useAuthStore } from '../../../store';

import styles from './AuthLayout.module.pcss';

export function AuthLayout() {
  const isRefreshTokenProblem = useAuthStore((state) => state.isRefreshTokenProblem);
  const refreshTokenExpires = useAuthStore((state) => state.refreshTokenExpires);

  if (refreshTokenExpires && !isRefreshTokenProblem) {
    return <Navigate to='/' />;
  }

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

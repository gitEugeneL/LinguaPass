import { Title } from '@clients/shared';

import { LoginForm } from '../../../../modules/auth';

import styles from './LoginPage.module.pcss';

export function LoginPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title title='Sign In' description='Start your journey with platform!' />
      </div>
      <LoginForm />
    </div>
  );
}

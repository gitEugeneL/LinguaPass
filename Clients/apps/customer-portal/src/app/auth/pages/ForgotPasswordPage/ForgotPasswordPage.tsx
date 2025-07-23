import { Title } from '@clients/shared';

import { ForgotPasswordForm } from '../../../../modules/auth';
import { CustomLink } from '../../../../UI';

import styles from './ForgotPasswordPage.module.pcss';

export function ForgotPasswordPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title title='Forgot Password' description='Enter email linked with your account' />
      </div>

      <ForgotPasswordForm />
      <div className={styles.navContainer}>
        <CustomLink label='Remember Password?' linkName='Login' linkUrl='/auth/login' />
      </div>
    </div>
  );
}

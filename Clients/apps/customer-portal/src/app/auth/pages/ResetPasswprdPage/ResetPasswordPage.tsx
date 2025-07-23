import { ResetPasswordForm } from '../../../../modules/auth';
import { CustomLink, Title } from '../../../../UI';

import styles from './ResetPassword.module.pcss';

export function ResetPasswordPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title title='Reset Password' description='Enter the code we just sent on your email' />
      </div>
      <ResetPasswordForm />
      <div className={styles.navContainer}>
        <CustomLink label='Did received code?' linkName='Resend' linkUrl='/auth/forgot-password' />
      </div>
    </div>
  );
}

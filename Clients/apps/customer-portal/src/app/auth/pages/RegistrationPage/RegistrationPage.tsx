import { Title } from '@clients/shared';

import { RegistrationForm } from '../../../../modules/auth';
import { CustomLink } from '../../../../UI';

import styles from './RegistrationPage.module.pcss';

export function RegistrationPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title title='Registration' description='Start your journey to education!' />
      </div>
      <RegistrationForm />
      <div className={styles.navContainer}>
        <CustomLink label='Already have an account?' linkName='Login' linkUrl='/auth/login' />
      </div>
    </div>
  );
}

import { Button } from '@clients/shared';
import { NavLink } from 'react-router';

import { LoginForm } from '../../../../modules/auth';
import { CustomLink, Title } from '../../../../UI';

import styles from './LoginPage.module.pcss';

export function LoginPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title title='Sign In' description='Start your journey to education!' />
      </div>
      <LoginForm />
      <div className={styles.navContainer}>
        <CustomLink label='Forgot Password?' linkName='Reset' linkUrl='/auth/forgot-password' />
        <NavLink className={styles.navlink} to='/auth/registration'>
          <Button name='Create account' size='large' appearance='secondary' />
        </NavLink>
      </div>
    </div>
  );
}

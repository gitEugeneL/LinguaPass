import styles from './LoginPage.module.pcss';
import Title from '../../../../UI/Title/Title.tsx';
import LoginForm from '../../../../modules/auth/LoginForm/LoginForm.tsx';
import CustomLink from '../../../../UI/CustomLink/CustomLink.tsx';
import { NavLink } from 'react-router';
import { Button } from '@clients/shared';

export default function LoginPage() {
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

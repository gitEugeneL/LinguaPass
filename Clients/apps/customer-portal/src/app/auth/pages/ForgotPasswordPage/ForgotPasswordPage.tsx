import Title from '../../../../UI/Title/Title.tsx';
import styles from './ForgotPasswordPage.module.pcss';
import CustomLink from '../../../../UI/CustomLink/CustomLink.tsx';
import ForgotPasswordForm from '../../../../modules/auth/ForgotPasswordForm/ForgotPasswordForm.tsx';

export default function ForgotPasswordPage() {
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

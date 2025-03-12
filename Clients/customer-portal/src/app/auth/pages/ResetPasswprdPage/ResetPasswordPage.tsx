import styles from './ResetPassword.module.pcss';
import Title from '../../../../UI/Title/Title.tsx';
import CustomLink from '../../../../UI/CustomLink/CustomLink.tsx';
import ResetPasswordForm from '../../../../modules/auth/ResetPasswordForm/ResetPasswordForm.tsx';

export default function ResetPasswordPage() {
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

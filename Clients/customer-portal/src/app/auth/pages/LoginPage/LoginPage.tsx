import styles from './LoginPage.module.pcss';
import Title from '../../../../UI/Title/Title.tsx';
import LoginForm from '../../../../modules/auth/LoginForm/LoginForm.tsx';

export default function LoginPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title title='Sign In' description='Start your journey to education!' />
        <LoginForm />
      </div>
    </div>
  );
}

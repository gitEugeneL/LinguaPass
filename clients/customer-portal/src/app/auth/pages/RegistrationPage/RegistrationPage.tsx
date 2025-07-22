import styles from './RegistrationPage.module.pcss';
import Title from '../../../../UI/Title/Title.tsx';
import RegistrationForm from '../../../../modules/auth/RegistrationForm/RegistrationForm.tsx';
import CustomLink from '../../../../UI/CustomLink/CustomLink.tsx';

export default function RegistrationPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Title
          title='Registration'
          description='Start your journey to education!'
        />
      </div>
      <RegistrationForm />
      <div className={styles.navContainer}>
        <CustomLink
          label='Already have an account?'
          linkName='Login'
          linkUrl='/auth/login'
        />
      </div>
    </div>
  );
}

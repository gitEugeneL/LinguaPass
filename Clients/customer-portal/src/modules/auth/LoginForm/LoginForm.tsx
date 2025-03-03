import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import { useForm } from 'react-hook-form';
import {
  LoginFormSchema,
  LoginFormValidationSchema
} from './LoginForm.schemes.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import PasswordInput from '../../../components/PasswordInput/PasswordInput.tsx';
import styles from './LoginForm.module.pcss';
import Button from '../../../UI/Button/Button.tsx';
import CustomLink from '../../../UI/CustomLink/CustomLink.tsx';
import { NavLink } from 'react-router';

export default function LoginForm() {
  const formSubmit = async (data: LoginFormSchema) => {
    console.log(data);
    // todo submit
  };

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormSchema>({
    resolver: yupResolver(LoginFormValidationSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: ''
    }
  });

  return (
    <>
      <form className={styles.formWrapper} onSubmit={handleSubmit(formSubmit)}>
        <CustomInput
          label='Email'
          name='email'
          placeholder='Enter your email'
          errors={errors}
          control={control}
        />

        <PasswordInput
          label='Password'
          name='password'
          placeholder='Enter your password'
          errors={errors}
          control={control}
        />

        <div className={styles.container}>
          <div className={styles.btnBlock}>
            <Button name='Sign In' size='large' />
            <CustomLink label='Forgot Password?' linkName='Reset' linkUrl='#' />
          </div>

          <NavLink to='#'>
            <Button name='Create account' size='large' appearance='secondary' />
          </NavLink>
        </div>
      </form>
    </>
  );
}

import styles from './LoginForm.module.pcss';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import { useForm } from 'react-hook-form';
import { LoginFormSchema, LoginFormValidationSchema } from './LoginForm.schemes.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import PasswordInput from '../../../components/auth/PasswordInput/PasswordInput.tsx';
import Button from '../../../UI/Button/Button.tsx';
import { useEffect, useState } from 'react';
import Notification from '../../../UI/Notification/Notification.tsx';
import { useAuthStore } from '../../../store/auth/auth.store.ts';

export default function LoginForm() {
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const resetError = useAuthStore((state) => state.resetError);
  const login = useAuthStore((state) => state.login);
  const resetState = useAuthStore((state) => state.resetState);

  useEffect(() => {
    resetState();
  }, []);

  // local error for notifications
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
    // reset main error
    resetError();
  }, [error]);

  // inputs error config
  useEffect(() => {
    if (error && !isLoading) {
      resetField('password');
      setFocus('email');
    }
  }, [error, isLoading]);

  const formSubmit = async (schema: LoginFormSchema) => {
    setLocalError(undefined);
    login(schema.email, schema.password);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField,
    setFocus
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
      <Notification message={localError} />
      <form onSubmit={handleSubmit(formSubmit)}>
        <div className={styles.formWrapper}>
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
        </div>

        <Button name='Sign In' size='large' isLoading={isLoading} />
      </form>
    </>
  );
}

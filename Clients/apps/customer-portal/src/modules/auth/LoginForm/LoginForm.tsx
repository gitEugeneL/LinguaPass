import { Button, CustomInput } from '@clients/shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

import { PasswordInput } from '../../../components/auth';
import { useAuthStore } from '../../../store';
import { Notification } from '../../../UI';

import styles from './LoginForm.module.pcss';
import { type LoginFormSchema, LoginFormValidationSchema } from './LoginForm.schemes.ts';

export function LoginForm() {
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const { isLoading, error, resetError, login, resetState } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      error: state.error,
      resetError: state.resetError,
      login: state.login,
      resetState: state.resetState
    }))
  );

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
    if (!isLoading) {
      login(schema.email, schema.password);
    }
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

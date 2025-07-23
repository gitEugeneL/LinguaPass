import { Button, CustomInput, Notification, PasswordInput } from '@clients/shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '../../../store';

import styles from './LoginForm.module.pcss';
import { type LoginFormSchema, LoginFormValidationSchema } from './LoginFormSchemes.ts';

export function LoginForm() {
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const { isLoading, error, resetError, loginAction } = useAuthStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      error: state.error,
      resetError: state.resetError,
      loginAction: state.login
    }))
  );

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
    resetError();
  }, [error]);

  useEffect(() => {
    if (error && !isLoading) {
      resetField('password');
      setFocus('login');
    }
  }, [error, isLoading]);

  const formSubmit = async (schema: LoginFormSchema) => {
    setLocalError(undefined);
    if (!isLoading) {
      loginAction(schema.login, schema.password);
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
      login: '',
      password: ''
    }
  });

  return (
    <>
      <Notification message={localError} />
      <form onSubmit={handleSubmit(formSubmit)}>
        <div className={styles.formWrapper}>
          <CustomInput
            label='Login'
            name='login'
            placeholder='Enter your login'
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

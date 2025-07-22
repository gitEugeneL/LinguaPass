import styles from './RegistrationForm.module.pcss';
import { useForm } from 'react-hook-form';
import {
  type RegistrationFormSchema,
  RegistrationFormValidationSchema
} from './RegistrationForm.schemes.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, CustomInput } from '@clients/shared';
import PasswordInput from '../../../components/auth/PasswordInput/PasswordInput.tsx';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/auth/auth.store.ts';
import Notification from '../../../UI/Notification/Notification.tsx';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

export default function RegistrationForm() {
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const { userId, isLoading, error, resetError, registration } = useAuthStore(
    useShallow((state) => ({
      userId: state.userId,
      isLoading: state.isLoading,
      error: state.error,
      resetError: state.resetError,
      registration: state.registration
    }))
  );

  // success redirect to login page
  useEffect(() => {
    if (userId) {
      navigate('/auth/login');
    }
  }, [userId]);

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
    if (localError && !isLoading) {
      resetField('email');
      setError('email', { type: 'manual', message: localError });
      setFocus('email');
    }
  }, [localError, isLoading]);

  const formSubmit = async (schema: RegistrationFormSchema) => {
    setLocalError(undefined);
    registration(schema.email, schema.password, schema.confirmPassword);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField,
    setFocus,
    setError
  } = useForm<RegistrationFormSchema>({
    resolver: yupResolver(RegistrationFormValidationSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
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
            control={control}
            errors={errors}
          />

          <PasswordInput
            label='Password'
            name='password'
            placeholder='Your strong password'
            control={control}
            errors={errors}
          />

          <PasswordInput
            label='Confirm password'
            name='confirmPassword'
            placeholder='Confirm your password'
            control={control}
            errors={errors}
          />
        </div>

        <Button name='Create account' size='large' isLoading={isLoading} />
      </form>
    </>
  );
}

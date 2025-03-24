import { useForm } from 'react-hook-form';
import {
  RegistrationFormSchema,
  RegistrationFormValidationSchema
} from './RegistrationForm.schemes.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import PasswordInput from '../../../components/auth/PasswordInput/PasswordInput.tsx';
import Button from '../../../UI/Button/Button.tsx';
import styles from './RegistrationForm.module.pcss';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/auth/auth.store.ts';
import Notification from '../../../UI/Notification/Notification.tsx';
import { useNavigate } from 'react-router';

export default function RegistrationForm() {
  const navigate = useNavigate();

  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const resetError = useAuthStore((state) => state.resetError);
  const registration = useAuthStore((state) => state.registration);
  const userId = useAuthStore((state) => state.userId);

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

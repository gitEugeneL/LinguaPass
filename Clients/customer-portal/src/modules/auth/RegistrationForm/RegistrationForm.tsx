import { useRegistrationState } from '../../../store/auth/registration/registration.state.ts';
import { useForm } from 'react-hook-form';
import {
  RegistrationFormSchema,
  RegistrationFormValidationSchema
} from './RegistrationForm.schemes.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import PasswordInput from '../../../components/PasswordInput/PasswordInput.tsx';
import Button from '../../../UI/Button/Button.tsx';
import styles from './RegistrationForm.module.pcss';
import Notification from '../../../UI/Notification/Notification.tsx';
import { RegistrationRequest } from '../../../store/auth/registration/registration.models.ts';
import { useEffect, useState } from 'react';
import { TIMER } from '../../../helpers/contans.tsx';

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLoading = useRegistrationState((state) => state.isLoading);
  const error = useRegistrationState((state) => state.error);
  const resetError = useRegistrationState((state) => state.resetError);
  const registration = useRegistrationState((state) => state.registration);

  // reset error (unmount component)
  useEffect(() => {
    return () => {
      resetError();
    };
  }, [resetError]);

  // block submit button (multiply clicking)
  useEffect(() => {
    if (isSubmitting && !isLoading) {
      const timer = setTimeout(() => {
        setIsSubmitting(false);
      }, TIMER);
      return () => clearTimeout(timer);
    }
  }, [isSubmitting, isLoading]);

  // show error response if email already exists (email input)
  useEffect(() => {
    if (error && !isLoading) {
      setError('email', { type: 'manual', message: error });
      const timer = setTimeout(() => {
        setError('email', {});
      }, TIMER);
      return () => clearTimeout(timer);
    }
  }, [error, isLoading]);

  const formSubmit = async (schema: RegistrationFormSchema) => {
    if (isSubmitting) {
      return;
    }
    const request: RegistrationRequest = {
      email: schema.email,
      password: schema.password,
      confirmPassword: schema.confirmPassword
    };
    setIsSubmitting(true);
    registration(request);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
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
      <Notification message={error} />

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

        <Button
          name='Create account'
          size='large'
          isLoading={isLoading}
          appearance={isSubmitting && !isLoading ? 'disabled' : 'primary'}
        />
      </form>
    </>
  );
}

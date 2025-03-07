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
import { useEffect } from 'react';
import { useRegistrationStore } from '../../../store/auth/registration/registration.store.ts';

export default function RegistrationForm() {
  const isLoading = useRegistrationStore((state) => state.isLoading);
  const error = useRegistrationStore((state) => state.error);
  const resetError = useRegistrationStore((state) => state.resetError);
  const registration = useRegistrationStore((state) => state.registration);

  // reset error (unmount component)
  useEffect(() => {
    return () => {
      resetError();
    };
  }, [resetError]);

  // reset email set focus and set error if email already exists (email input)
  useEffect(() => {
    if (error && !isLoading) {
      resetField('email');
      setFocus('email');
      setError('email', { type: 'manual', message: error });
    }
  }, [error, isLoading]);

  const formSubmit = async (schema: RegistrationFormSchema) => {
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

        <Button name='Create account' size='large' isLoading={isLoading} />
      </form>
    </>
  );
}

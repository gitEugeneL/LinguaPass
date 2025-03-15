import {
  ForgotPasswordFormSchema,
  ForgotPasswordFormValidationSchema
} from './ForgotPasswordForm.schemes.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import styles from './ForgotPasswordForm.module.pcss';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import Button from '../../../UI/Button/Button.tsx';
import { useAuthStore } from '../../../store/auth/auth.store.ts';
import Notification from '../../../UI/Notification/Notification.tsx';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router';

export default function ForgotPasswordForm() {
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const generateCode = useAuthStore((state) => state.generateCode);
  const codeExpires = useAuthStore((state) => state.codeExpires);
  const email = useAuthStore((state) => state.email);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const resetError = useAuthStore((state) => state.resetError);
  const resetCodeData = useAuthStore((state) => state.resetCodeData);

  useEffect(() => {
    resetCodeData();
  }, []);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      resetField('email');
    }
    resetError();
  }, [error]);

  const formSubmit = async (schema: ForgotPasswordFormSchema) => {
    setLocalError(undefined);
    generateCode(schema.email);
    resetField('email');
  };

  const {
    control,
    handleSubmit,
    resetField,
    formState: { errors }
  } = useForm<ForgotPasswordFormSchema>({
    resolver: yupResolver(ForgotPasswordFormValidationSchema),
    mode: 'all',
    defaultValues: {
      email: ''
    }
  });

  if (codeExpires && email) {
    return <Navigate to='/auth/reset-password' />;
  }

  return (
    <>
      <Notification message={localError} />
      <form onSubmit={handleSubmit(formSubmit)}>
        <div className={styles.formWrapper}>
          <CustomInput
            label='Your email'
            name='email'
            placeholder='Enter your email'
            control={control}
            errors={errors}
          />
        </div>
        <Button name='Send code' size='large' isLoading={isLoading} />
      </form>
    </>
  );
}

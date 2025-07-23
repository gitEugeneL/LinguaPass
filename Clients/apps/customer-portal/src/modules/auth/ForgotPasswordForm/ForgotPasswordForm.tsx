import { Button, CustomInput } from '@clients/shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '../../../store';
import { Notification } from '../../../UI';

import styles from './ForgotPasswordForm.module.pcss';
import {
  type ForgotPasswordFormSchema,
  ForgotPasswordFormValidationSchema
} from './ForgotPasswordForm.schemes.ts';

export function ForgotPasswordForm() {
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const { generateCode, codeExpires, email, isLoading, error, resetError, resetCodeData } =
    useAuthStore(
      useShallow((state) => ({
        isLoading: state.isLoading,
        error: state.error,
        codeExpires: state.codeExpires,
        email: state.email,
        resetError: state.resetError,
        generateCode: state.generateCode,
        resetCodeData: state.resetCodeData
      }))
    );

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

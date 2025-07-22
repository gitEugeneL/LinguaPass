import styles from './ResetPasswordForm.module.pcss';
import { useAuthStore } from '../../../store/auth/auth.store.ts';
import { Navigate, useNavigate } from 'react-router';
import * as React from 'react';
import { useEffect } from 'react';
import { Button } from '@clients/shared';
import Countdown from '../../../components/auth/Countdown/Countdown.tsx';
import CodeInput from '../../../components/auth/CodeInput/CodeInput.tsx';
import { useForm } from 'react-hook-form';
import {
  type ResetPasswordFormSchema,
  ResetPasswordFormValidationSchema
} from './ResetPassword.schemes.ts';
import PasswordInput from '../../../components/auth/PasswordInput/PasswordInput.tsx';
import { yupResolver } from '@hookform/resolvers/yup';
import { useShallow } from 'zustand/react/shallow';

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const { isLoading, codeExpires, email, error, resetCodeData, resetPassword, isPasswordChanged } =
    useAuthStore(
      useShallow((state) => ({
        isLoading: state.isLoading,
        codeExpires: state.codeExpires,
        email: state.email,
        error: state.error,
        resetCodeData: state.resetCodeData,
        resetPassword: state.resetPassword,
        isPasswordChanged: state.isPasswordChanged
      }))
    );

  const codeInputsCount = 4;

  // reset state (expired time) for redirect
  useEffect(() => {
    if (!codeExpires || !email) {
      resetCodeData();
      return;
    }
    const timeoutId = setTimeout(resetCodeData, +new Date(codeExpires) - Date.now());
    return () => clearTimeout(timeoutId);
  }, [codeExpires, email]);

  useEffect(() => {
    if (isPasswordChanged) {
      navigate('/auth/login');
    }
  }, [isPasswordChanged]);

  useEffect(() => {
    if (error) {
      resetCodeData();
    }
  }, [error]);

  const {
    control,
    handleSubmit,
    setFocus,
    formState: { errors }
  } = useForm<ResetPasswordFormSchema>({
    resolver: yupResolver(ResetPasswordFormValidationSchema),
    mode: 'all',
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
      code: Array(codeInputsCount).fill('')
    }
  });

  // change code input focus <--
  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && e.currentTarget.value === '' && index > 0) {
      setFocus(`code.${index - 1}`);
    }
  };

  // change code input focus -->
  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 1 && index < codeInputsCount - 1) {
      setFocus(`code.${index + 1}`);
    }
  };

  const formSubmit = async (data: ResetPasswordFormSchema) => {
    const code = data.code.join('');
    resetPassword(code, data.newPassword, data.confirmNewPassword);
  };

  if (!codeExpires || !email) {
    return <Navigate to='/auth/forgot-password' />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(formSubmit)}>
        <div className={styles.formWrapper}>
          <PasswordInput
            label='New password'
            name='newPassword'
            control={control}
            errors={errors}
            placeholder='Enter new password'
          />

          <PasswordInput
            label='Confirm password'
            name='confirmNewPassword'
            control={control}
            errors={errors}
            placeholder='Confirm new password'
          />

          <div className={styles.codeWrapper}>
            {Array.from({ length: codeInputsCount }).map((_, index) => (
              <CodeInput
                key={index}
                name={`code.${index}`}
                control={control}
                errors={errors}
                placeholder='-'
                onKeyDown={handleKeyDown(index)}
                onInput={handleChange(index)}
              />
            ))}
          </div>

          <div className={styles.countdownWrapper}>
            <Countdown datetime={codeExpires} />
          </div>

          <Button name='Reset password' size='large' isLoading={isLoading} type='submit' />
        </div>
      </form>
    </>
  );
}

import { useForm } from 'react-hook-form';
import {
  RegistrationFormSchema,
  RegistrationFormValidationSchema
} from './RegistrationForm.schemes.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import styles from './RegistrationForm.module.pcss';
import PasswordInput from '../../../components/PasswordInput/PasswordInput.tsx';
import Button from '../../../UI/Button/Button.tsx';

export default function RegistrationForm() {
  const formSubmit = async () => {
    // todo submit
  };

  const {
    control,
    handleSubmit,
    formState: { errors }
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

        <Button name='Create account' size='large' />
      </form>
    </>
  );
}

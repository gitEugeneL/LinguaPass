import * as yup from 'yup';

export interface LoginFormSchema {
  email: string;
  password: string;
}

export const LoginFormValidationSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup.string().required('Password is required').min(8, 'Too short').max(20, 'Too long')
});

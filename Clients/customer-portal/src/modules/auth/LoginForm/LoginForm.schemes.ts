import * as yup from 'yup';

export interface LoginFormSchema {
  email: string;
  password: string;
}

export const LoginFormValidationSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),
  password: yup
    .string()
    .required('Password is required')
    .max(20, 'Over 20 characters')
});

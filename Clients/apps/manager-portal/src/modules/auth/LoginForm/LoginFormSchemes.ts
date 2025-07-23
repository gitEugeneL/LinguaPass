import * as yup from 'yup';

export interface LoginFormSchema {
  login: string;
  password: string;
}

export const LoginFormValidationSchema = yup.object({
  login: yup.string().required('Login is required').email('Invalid login'),
  password: yup.string().required('Password is required').min(8, 'Too short').max(20, 'Too long')
});

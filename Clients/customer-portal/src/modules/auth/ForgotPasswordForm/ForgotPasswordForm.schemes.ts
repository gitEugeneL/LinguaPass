import * as yup from 'yup';

export interface ForgotPasswordFormSchema {
  email: string;
}

export const ForgotPasswordFormValidationSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email')
});

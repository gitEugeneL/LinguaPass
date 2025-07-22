import * as yup from 'yup';

export interface RegistrationFormSchema {
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegistrationFormValidationSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email'),

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Too short')
    .max(20, 'Too long')
    .matches(/[a-zA-Z]/, 'No letters')
    .matches(/[A-Z]/, 'No uppercase')
    .matches(/\d/, 'No digit')
    .matches(/[^a-zA-Z0-9]/, 'No special'),

  confirmPassword: yup
    .string()
    .required('Confirmation is required')
    .oneOf([yup.ref('password')], 'Passwords must match')
});

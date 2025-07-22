import * as yup from 'yup';

export interface ResetPasswordFormSchema {
  code: string[];
  newPassword: string;
  confirmNewPassword: string;
}

export const ResetPasswordFormValidationSchema = yup.object({
  code: yup
    .array()
    .of(yup.string().length(1, 'Must be exactly one character').required('Code is required'))
    .required('Code is required'),

  newPassword: yup
    .string()
    .required('Password is required')
    .min(8, 'Too short')
    .max(20, 'Too long')
    .matches(/[a-zA-Z]/, 'No letters')
    .matches(/[A-Z]/, 'No uppercase')
    .matches(/\d/, 'No digit')
    .matches(/[^a-zA-Z0-9]/, 'No special'),

  confirmNewPassword: yup
    .string()
    .required('Confirmation is required')
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
});

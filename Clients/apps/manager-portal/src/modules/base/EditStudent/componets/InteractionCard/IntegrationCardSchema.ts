import * as yup from 'yup';

export interface IntegrationCardSchema {
  message: string;
}

export const IntegrationCardValidationSchema = yup.object({
  message: yup.string().required().min(2, 'Too short').max(800, 'Too long')
});

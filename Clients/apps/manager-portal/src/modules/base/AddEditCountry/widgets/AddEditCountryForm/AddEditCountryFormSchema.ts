import * as yup from 'yup';

export interface AddEditCountryFormSchema {
  name: string;
}

export const AddEditCountryFormValidationSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Too short').max(50, 'Too long')
});

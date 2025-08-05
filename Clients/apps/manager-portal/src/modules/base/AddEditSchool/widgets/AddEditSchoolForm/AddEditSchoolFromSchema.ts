import * as yup from 'yup';

export interface AddEditSchoolFormSchema {
  name: string;
  shortName: string;
  city: string;
  languages: string[];
}

export const AddEditSchoolFormValidationSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Too short').max(100, 'Too long'),

  shortName: yup
    .string()
    .required('Short name is required')
    .min(2, 'Too short')
    .max(10, 'Too long'),

  city: yup.string().required('City is required').min(2, 'Too short').max(20, 'Too long'),

  languages: yup
    .array()
    .required('At least one language is required')
    .min(1, 'At least one language must be selected')
});

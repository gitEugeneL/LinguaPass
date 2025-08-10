import * as yup from 'yup';

export interface AddEditCourseFormSchema {
  name: string;
  description: string;
  activities: string;
  duration: string;
  price: string;
  admissionFee: string;
  withAccommodation: boolean;
  language: string;
}

const priceRegex = /^[0-9]{1,6}$/;

export const AddEditCourseFormValidationSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Too short').max(50, 'Too long'),

  description: yup
    .string()
    .required('Description is required')
    .min(2, 'Too short')
    .max(300, 'Too long'),

  duration: yup.string().required('Duration is required').min(2, 'Too short').max(10, 'Too long'),

  activities: yup
    .string()
    .required('Activities is required')
    .min(2, 'Too short')
    .max(100, 'Too long'),

  price: yup.string().required('Price is required').matches(priceRegex, 'Invalid price'),

  withAccommodation: yup.boolean().required('Accommodation is required'),

  admissionFee: yup
    .string()
    .required('Admission fee is required')
    .matches(priceRegex, 'Invalid admission fee'),

  language: yup.string().required('Course language is required')
});

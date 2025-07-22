import * as yup from 'yup';

export interface ContactFormSchema {
  name: string;
  surname: string;
  middleName?: string | null;
  maidenName?: string | null;
  gender: 'female' | 'male';
  phone: string;
  typeOfSettlement: 'city' | 'village';
  street: string;
  hsApt: string;
  city: string;
  country: string;
  postcode: string;
  corrStreet?: string | undefined;
  corrHsApt?: string | undefined;
  corrCity?: string | undefined;
  corrCountry?: string | undefined;
  corrPostcode?: string | undefined;
}

export const contactDefaultValues: ContactFormSchema = {
  name: '',
  surname: '',
  middleName: '',
  maidenName: '',
  gender: 'male',
  phone: '',
  typeOfSettlement: 'city',
  street: '',
  hsApt: '',
  city: '',
  country: '',
  postcode: '',
  corrStreet: '',
  corrHsApt: '',
  corrCity: '',
  corrCountry: '',
  corrPostcode: ''
};

const postcodeRegex = /^[0-9A-Za-z-]{5,6}$/;
const phoneRegex = /^\+?[0-9]{10,12}$/;

export const createContactFormValidationSchema = (correspondAddrExists: boolean) =>
  yup.object({
    name: yup.string().required('Name is required').min(2, 'Too short').max(20, 'Too long'),

    surname: yup.string().required('Surname is required').min(2, 'Too short').max(50, 'Too long'),

    middleName: yup
      .string()
      .notRequired()
      .min(2, 'Too short')
      .max(20, 'Too long')
      .transform((value, originalValue) => (originalValue === '' ? null : value)),

    maidenName: yup
      .string()
      .notRequired()
      .min(2, 'Too short')
      .max(20, 'Too long')
      .transform((value, originalValue) => (originalValue === '' ? null : value)),

    gender: yup.string().oneOf(['female', 'male']).required('Gender is required'),

    phone: yup.string().required('Phone is required').matches(phoneRegex, 'Invalid phone number'),

    typeOfSettlement: yup
      .string()
      .oneOf(['city', 'village'])
      .required('Type of settlement is required'),

    street: yup.string().required('Street is required').min(2, 'Too short').max(50, 'Too long'),

    hsApt: yup.string().required('House is required').min(2, 'Too short').max(10, 'Too long'),

    city: yup.string().required('City is required').min(2, 'Too short').max(30, 'Too long'),

    country: yup.string().required('Country is required').min(2, 'Too short').max(30, 'Too long'),

    postcode: yup
      .string()
      .required('Postcode is required')
      .matches(postcodeRegex, 'Invalid postcode'),

    corrStreet: yup.string().when([], {
      is: () => correspondAddrExists,
      then: (schema) =>
        schema.required('Street is required').min(2, 'Too short').max(50, 'Too long'),
      otherwise: (schema) =>
        schema
          .notRequired()
          .transform((value, originalValue) => (originalValue === '' ? null : value))
    }),

    corrHsApt: yup.string().when([], {
      is: () => correspondAddrExists,
      then: (schema) =>
        schema.required('House is required').min(2, 'Too short').max(10, 'Too long'),
      otherwise: (schema) =>
        schema
          .notRequired()
          .transform((value, originalValue) => (originalValue === '' ? null : value))
    }),

    corrCity: yup.string().when([], {
      is: () => correspondAddrExists,
      then: (schema) => schema.required('City is required').min(2, 'Too short').max(30, 'Too long'),
      otherwise: (schema) =>
        schema
          .notRequired()
          .transform((value, originalValue) => (originalValue === '' ? null : value))
    }),

    corrCountry: yup.string().when([], {
      is: () => correspondAddrExists,
      then: (schema) =>
        schema.required('Country is required').min(2, 'Too short').max(30, 'Too long'),
      otherwise: (schema) =>
        schema
          .notRequired()
          .transform((value, originalValue) => (originalValue === '' ? null : value))
    }),

    corrPostcode: yup.string().when([], {
      is: () => correspondAddrExists,
      then: (schema) =>
        schema.required('Postcode is required').matches(postcodeRegex, 'Invalid postcode'),
      otherwise: (schema) =>
        schema
          .notRequired()
          .transform((value, originalValue) => (originalValue === '' ? null : value))
    })
  });

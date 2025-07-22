import * as yup from 'yup';

export interface PersonalFormSchema {
  birthday: Date;
  birthPlace: string;
  countryOfBirth: string;
  fathersName: string;
  mothersName: string;
  nationality: string;
  idNumber: string;
  countryOfIssue: string;
  contactName: string;
  contactSurname: string;
  relationship: string;
  contactPhone: string;
  educationLevel: 'secondary' | 'bachelor' | 'master' | 'phd';
}

export const personalDefaultValues: PersonalFormSchema = {
  birthday: undefined as unknown as Date,
  birthPlace: '',
  countryOfBirth: '',
  fathersName: '',
  mothersName: '',
  nationality: '',
  idNumber: '',
  countryOfIssue: '',
  contactName: '',
  contactSurname: '',
  relationship: '',
  contactPhone: '',
  educationLevel: 'secondary'
};

const phoneRegex = /^\+?[0-9]{10,12}$/;

export const PersonalFormValidationSchema = yup.object({
  birthday: yup
    .date()
    .required('Birthday is required')
    .max(
      new Date(new Date().setDate(new Date().getDate() - 1)),
      'Birthday cannot be in the future'
    ),

  birthPlace: yup
    .string()
    .required('Birth place is required')
    .min(2, 'Too short')
    .max(50, 'Too long'),

  countryOfBirth: yup
    .string()
    .required('Country of birth is required')
    .min(2, 'Too short')
    .max(30, 'Too long'),

  fathersName: yup
    .string()
    .required('Father’s name is required')
    .min(2, 'Too short')
    .max(20, 'Too long'),

  mothersName: yup
    .string()
    .required('Mother’s name is required')
    .min(2, 'Too short')
    .max(20, 'Too long'),

  nationality: yup
    .string()
    .required('Nationality is required')
    .min(2, 'Too short')
    .max(30, 'Too long'),

  idNumber: yup
    .string()
    .required('ID card number is required')
    .min(5, 'Too short')
    .max(50, 'Too long'),

  countryOfIssue: yup
    .string()
    .required('Country of issue is required')
    .min(2, 'Too short')
    .max(30, 'Too long'),

  contactName: yup
    .string()
    .required('Contact’s name is required')
    .min(2, 'Too short')
    .max(20, 'Too long'),

  contactSurname: yup
    .string()
    .required('Contact’s surname is required')
    .min(2, 'Too short')
    .max(50, 'Too long'),

  relationship: yup
    .string()
    .required('Relationship is required')
    .min(2, 'Too short')
    .max(20, 'Too long'),

  contactPhone: yup
    .string()
    .required('Contact’s phone is required')
    .matches(phoneRegex, 'Invalid phone number'),

  educationLevel: yup
    .string()
    .oneOf(['secondary', 'bachelor', 'master', 'phd'])
    .required('Education level is required')
});

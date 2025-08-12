export interface StudentResponse {
  accountId: string;
  name: string | null;
  surname: string | null;
  schoolId: string | null;
  courseId: string | null;
  languageId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface StudentDetailResponse {
  accountId: string;
  schoolId: string | null;
  courseId: string | null;
  languageId: string | null;
  userId: string | null;
  isActive: boolean;
  contact: Contact | null;
  personal: Personal | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface Contact {
  contactId: string;
  name: string;
  surname: string;
  phone: string;
  middleName: string | null;
  maidenName: string | null;
  gender: string;
  typeOfSettlement: string;
  street: string;
  hsApt: string;
  city: string;
  country: string;
  postcode: string;
  corrStreet: string | null;
  corrHsApt: string | null;
  corrCity: string | null;
  corrCountry: string | null;
  corrPostcode: string | null;
}

export interface Personal {
  personalId: string;
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
  educationLevel: string;
}

export interface GetStudentsResponse {
  items: StudentResponse[];
  totalItemsCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export type GetStudentDetailResponse = StudentDetailResponse;

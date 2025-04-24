export interface Contact {
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
  corrStreet?: string | null;
  corrHsApt?: string | null;
  corrCity?: string | null;
  corrCountry?: string | null;
  corrPostcode?: string | null;
}

export type CreateContactRequest = Contact;

export interface CreateContactResponse {
  userId: string;
  contactId: string;
}

export interface GetCurrentContactResponse extends Contact {
  contactId: string;
}

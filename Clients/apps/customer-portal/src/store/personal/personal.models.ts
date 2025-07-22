export interface Personal {
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

export interface CreatePersonalResponse {
  userId: string;
  personalId: string;
}

export interface GetCurrentPersonalResponse extends Personal {
  personalId: string;
}

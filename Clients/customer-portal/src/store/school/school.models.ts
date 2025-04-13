export interface Country {
  countryId: string;
  name: string;
  isActive: boolean;
  schoolsCount: number;
}

export interface School {
  schoolId: string;
  name: string;
  city: string;
  isActive: boolean;
  countryId: string;
}

export type GetSchoolById = School;

export interface GetCountriesResponse {
  items: Country[];
}

export interface GetSchoolsResponse {
  items: School[];
}

export interface ChooseSchoolRequest {
  languageId: string;
  schoolId: string;
}

export interface ChooseSchoolResponse {
  userId: string;
  schoolId: string;
}

export interface GetCurrentSchoolIdResponse {
  schoolId: string;
}

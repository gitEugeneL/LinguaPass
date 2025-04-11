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
}

export interface GetCountriesResponse {
  items: Country[];
}

export interface GetSchoolsResponse {
  items: School[];
}

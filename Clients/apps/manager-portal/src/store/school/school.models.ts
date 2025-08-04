export interface School {
  name: string;
  city: string;
  isActive: boolean;
  countryId: string;
}

export interface Language {
  languageId: string;
  name: string;
}

export interface SchoolResponse extends School {
  schoolId: string;
  tracksCount: number;
  languages: Language[];
}

export interface GetSchoolsResponse {
  items: SchoolResponse[];
}

import { type Language } from '../index.ts';

export interface School {
  name: string;
  shortName: string;
  city: string;
  isActive: boolean;
  countryId: string;
}

export interface SchoolResponse extends School {
  schoolId: string;
  tracksCount: number;
  languages: Language[];
}

export interface CreateSchoolRequest extends School {
  languageIds: string[];
}

export interface UpdateSchoolRequest {
  schoolId: string;
  countryId: string;
  name?: string | null;
  shortName?: string | null;
  city?: string | null;
  isActive?: boolean | null;
  languageIds: string[];
}

export interface GetSchoolsResponse {
  items: SchoolResponse[];
}

export type GetSchoolByIdResponse = SchoolResponse;

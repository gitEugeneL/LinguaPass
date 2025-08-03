export interface Country {
  name: string;
  isActive: boolean;
}

export interface CountryResponse extends Country {
  countryId: string;
  schoolsCount: number;
}

export interface UpdateCountryRequest {
  countryId: string;
  name?: string | null;
  isActive?: boolean | null;
}

export interface GetCountriesResponse {
  items: CountryResponse[];
}

export type GetCountryByIdResponse = CountryResponse;
export type CreateUpdateCountryResponse = CountryResponse;

export interface Country {
  countryId: string;
  name: string;
  isActive: boolean;
  schoolsCount: number;
}

export interface GetCountriesResponse {
  items: Country[];
}

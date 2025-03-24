export interface Language {
  languageId: string;
  name: string;
  description: string;
}

export interface GetLanguagesResponse {
  items: Language[];
}

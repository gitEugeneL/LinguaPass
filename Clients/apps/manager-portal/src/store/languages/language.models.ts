export interface Language {
  languageId: string;
  name: string;
}

export interface GetLanguagesResponse {
  items: Language[];
}

export interface Language {
  languageId: string;
  name: string;
  description: string;
}

export interface GetLanguagesResponse {
  items: Language[];
}

export interface ChooseLanguageRequest {
  languageId: string;
}

export interface ChooseLanguageResponse {
  userId: string;
  languageId: string;
}

export interface GetMyLanguageIdResponse {
  languageId: string;
}

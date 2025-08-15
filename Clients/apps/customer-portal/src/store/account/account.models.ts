export interface Account {
  userId: string;
  languageId: string | null;
  schoolId: string | null;
  courseId: string | null;
  contactId: string | null;
  personalId: string | null;
  documentsId: string | null;
  applicationNote: string | null;
  isApplicationComplete: boolean;
}

export type GetCurrentAccount = Account;

export interface UserData {
  name: string;
  surname: string;
}

export type GetShortUserInfoResponse = UserData;

export interface SendApplicationResponse {
  userId: string;
}

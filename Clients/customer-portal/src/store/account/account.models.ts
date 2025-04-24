export interface Account {
  userId: string;
  languageId: string | null;
  schoolId: string | null;
  courseId: string | null;
  contactId: string | null;
}

export type GetCurrentAccount = Account;

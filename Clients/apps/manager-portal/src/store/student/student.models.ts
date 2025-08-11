export interface Student {}
export interface StudentDetail {}

export interface StudentResponse {
  accountId: string;
  name: string | null;
  surname: string | null;
  schoolId: string | null;
  courseId: string | null;
  languageId: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface GetStudentsResponse {
  items: StudentResponse[];
  totalItemsCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

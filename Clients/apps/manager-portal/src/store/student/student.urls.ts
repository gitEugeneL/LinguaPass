import { ACCOUNT } from '@clients/shared';

export const studentUrls = {
  getAllStudents: `${ACCOUNT}/customers`,

  getStudentDetail: (studentId: string) => `${ACCOUNT}/customers/${studentId}`,

  finalizeApplication: `${ACCOUNT}/complete-application`,

  changeActive: (studentId: string) => `${ACCOUNT}/change-active/${studentId}`
};

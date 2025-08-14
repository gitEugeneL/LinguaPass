import { PROGRESS } from '@clients/shared';

export const progressUrls = {
  getStatuses: `${PROGRESS}/statuses`,

  getStudentStatus: (userId: string) => `${PROGRESS}/status/${userId}`
};

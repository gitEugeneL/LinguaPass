import { STORAGE } from '@clients/shared';

export const storageUrls = {
  getFileNames: (userId: string) => `${STORAGE}/files/customers/${userId}`,

  downloadFile: (userId: string, fileName: string) => `${STORAGE}/download/${userId}/${fileName}`
};

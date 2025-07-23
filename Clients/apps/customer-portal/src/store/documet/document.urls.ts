import { STORAGE } from '@clients/shared';

export const storageUrls = {
  uploadFile: `${STORAGE}/upload`,

  getUploadedFiles: `${STORAGE}/files`,

  deleteFile: (fileName: string) => `${STORAGE}/files/${fileName}`
};

import { STORAGE } from '../../helpers';

export const storageUrls = {
  uploadFile: `${STORAGE}/upload`,

  getUploadedFiles: `${STORAGE}/files`,

  deleteFile: (fileName: string) => `${STORAGE}/files/${fileName}`
};

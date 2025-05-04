import { STORAGE } from '../../helpers/api.tsx';

export const storageUrls = {
  uploadFile: `${STORAGE}/upload`,

  getUploadedFiles: `${STORAGE}/files`,

  deleteFile: (fileName: string) => `${STORAGE}/files/${fileName}`
};

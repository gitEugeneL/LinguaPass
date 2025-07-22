export interface UploadFileResponse {
  fileNames: string[];
}

export type GetUploadedFilesResponse = UploadFileResponse;

export interface DeleteFileResponse {
  isSuccess: boolean;
}

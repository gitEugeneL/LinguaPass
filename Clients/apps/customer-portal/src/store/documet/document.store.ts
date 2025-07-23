import axios, { type AxiosProgressEvent, type CancelTokenSource } from 'axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { createAuthHeader } from '../../helpers';
import { useAuthStore } from '../index.ts';

import { type DeleteFileResponse, type GetUploadedFilesResponse } from './document.models.ts';
import { storageUrls } from './document.urls.ts';

interface DocumentsState {
  files: File[];
  uploadedFileNames: string[];

  progress: number;
  error: string | null;
  isLoading: boolean;
  uploadingFileIndex: number | null;
  addFilesToList: (newFiles: File[]) => void;
  removeFileFromList: (index: number) => void;

  uploadFile: (index: number) => Promise<void>;
  getUploadedFiles: () => Promise<void>;
  deleteFile: (fileName: string) => Promise<void>;

  cancelUpload: () => void;
  resetError: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;
let cancelTokenSource: CancelTokenSource | null = null;

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set, get) => ({
      files: [],
      uploadedFileNames: [],
      progress: 0,
      error: null,
      isLoading: false,
      uploadingFileIndex: null,

      addFilesToList: (newFiles) => {
        const currentFilesCount = get().files.length;
        const remainingCapacity = MAX_FILES - currentFilesCount - get().uploadedFileNames.length;

        if (newFiles.length > remainingCapacity) {
          set({ error: `No more than ${MAX_FILES} files` });
          return;
        }

        const validFiles = newFiles.filter((file) => {
          if (file.type !== 'application/pdf') {
            set({ error: 'File is not PDF' });
            return false;
          }
          if (file.size > MAX_FILE_SIZE) {
            set({ error: `File size larger than  ${MAX_FILE_SIZE}` });
            return false;
          }
          return true;
        });

        const normalizedFiles = validFiles.map((file) => {
          let newFileName = file.name.toLowerCase().replace(/\s+/g, '-');
          const existingFiles = [...get().files.map((f) => f.name), ...get().uploadedFileNames];

          if (existingFiles.includes(newFileName)) {
            const nameWithoutExt = newFileName.replace('.pdf', '');
            let counter = 1;

            while (existingFiles.includes(`${nameWithoutExt}(${counter}).pdf`)) {
              counter++;
            }
            newFileName = `${nameWithoutExt}(${counter}).pdf`;
          }

          return new File([file], newFileName, {
            type: file.type
          });
        });

        set((state) => ({
          files: [...state.files, ...normalizedFiles],
          error: validFiles.length === newFiles.length ? null : state.error,
          progress: 0
        }));
      },

      removeFileFromList: (index) => {
        set((state) => ({
          files: state.files.filter((_, i) => i !== index),
          error: null,
          uploadingFileIndex: state.uploadingFileIndex === index ? null : state.uploadingFileIndex,
          isLoading: state.uploadingFileIndex === index ? false : state.isLoading,
          progress: state.uploadingFileIndex === index ? 0 : state.progress
        }));
      },

      uploadFile: async (index) => {
        const { files, isLoading } = get();

        if (get().uploadedFileNames.length >= MAX_FILES) {
          set({ error: `No more than ${MAX_FILES} files` });
        }

        if (isLoading) {
          set({ error: 'Another file is already uploading' });
          return;
        }
        if (index < 0 || index >= files.length) {
          set({ error: 'File not found' });
          return;
        }

        const file = files[index];
        set({ isLoading: true, error: null, uploadingFileIndex: index });
        cancelTokenSource = axios.CancelToken.source();

        const formData: FormData = new FormData();
        formData.append('file', file);

        try {
          await axios.post(storageUrls.uploadFile, formData, {
            headers: createAuthHeader(useAuthStore.getState().accessToken),
            cancelToken: cancelTokenSource.token,
            onUploadProgress: (progressEvent: AxiosProgressEvent): void => {
              const percentCompleted: number = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total!
              );
              set({ progress: percentCompleted });
            }
          });
          set((state) => ({
            files: state.files.filter((_, i) => i !== index),
            progress: 100,
            uploadedFileNames: [...state.uploadedFileNames, file.name]
          }));
        } catch (error) {
          if (error instanceof axios.AxiosError) {
            set({ error: error.response?.data || 'Uploading error' });
          }
        } finally {
          cancelTokenSource = null;
          set({
            isLoading: false,
            uploadingFileIndex: null,
            progress: 0
          });
        }
      },

      cancelUpload: () => {
        if (cancelTokenSource) {
          cancelTokenSource.cancel();
          cancelTokenSource = null;
        }
      },

      getUploadedFiles: async () => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.get<GetUploadedFilesResponse>(storageUrls.getUploadedFiles, {
            headers: createAuthHeader(useAuthStore.getState().accessToken)
          });
          set({ uploadedFileNames: data.fileNames });
        } catch {
          set({ error: 'Files load error' });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteFile: async (fileName) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await axios.delete<DeleteFileResponse>(
            storageUrls.deleteFile(fileName),
            {
              headers: createAuthHeader(useAuthStore.getState().accessToken)
            }
          );
          if (data.isSuccess) {
            set({ uploadedFileNames: get().uploadedFileNames.filter((name) => name !== fileName) });
          }
        } catch {
          set({
            error: 'Invalid file',
            uploadedFileNames: []
          });
        } finally {
          set({ isLoading: false });
        }
      },

      resetError: () => set({ error: null })
    }),
    {
      name: 'documents',
      partialize: (state: DocumentsState) => ({
        uploadedFileNames: state.uploadedFileNames
      })
    }
  )
);

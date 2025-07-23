import { type ChangeEvent, useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useDocumentsStore } from '../../../store';

import { FileCard, FileInput, UploadedFile } from './components';
import styles from './FileUploader.module.pcss';

export function FileUploader() {
  const {
    files,
    uploadedFileNames,
    error,
    isLoading,
    progress,
    uploadingFileIndex,
    addFilesToList,
    removeFileFromList,
    uploadFile,
    getUploadedFiles,
    deleteFile,
    cancelUpload,
    resetError
  } = useDocumentsStore(
    useShallow((state) => ({
      files: state.files,
      uploadedFileNames: state.uploadedFileNames,
      error: state.error,
      isLoading: state.isLoading,
      progress: state.progress,
      uploadingFileIndex: state.uploadingFileIndex,
      addFilesToList: state.addFilesToList,
      removeFileFromList: state.removeFileFromList,
      uploadFile: state.uploadFile,
      getUploadedFiles: state.getUploadedFiles,
      deleteFile: state.deleteFile,
      cancelUpload: state.cancelUpload,
      resetError: state.resetError
    }))
  );

  useEffect(() => {
    if (uploadedFileNames.length === 0) {
      const fetchData = async () => {
        await getUploadedFiles();
      };
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        resetError();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, resetError]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles: File[] = Array.from(event.target.files || []);
    addFilesToList(selectedFiles);
    event.target.value = '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <span>It's nearly the end :)</span>
      </div>
      <FileInput handleFileChange={handleFileChange} isLoading={isLoading} error={error} />

      {uploadedFileNames.length > 0 && (
        <div className={styles.wrapper}>
          <span className={styles.listTitle}>List of uploaded files:</span>
          <ul className={styles.fileContainer}>
            {uploadedFileNames.map((item, index) => (
              <UploadedFile
                key={index}
                index={index}
                name={item}
                deleteFile={deleteFile}
                isLoading={isLoading}
              />
            ))}
          </ul>
        </div>
      )}
      {files.length > 0 && (
        <div className={styles.wrapper}>
          <span className={styles.listTitle}>List of files ready for upload:</span>
          <ul className={styles.fileContainer}>
            {files.map((file, index) => (
              <FileCard
                key={index}
                index={index}
                name={file.name}
                size={file.size}
                removeFile={() => removeFileFromList(index)}
                uploadFile={() => uploadFile(index)}
                cancelUpload={cancelUpload}
                isLoading={isLoading && uploadingFileIndex === index}
                uploadingFileIndex={uploadingFileIndex}
                progress={progress}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

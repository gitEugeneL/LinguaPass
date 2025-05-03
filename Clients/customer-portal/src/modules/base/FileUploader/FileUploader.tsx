import styles from './FileUploader.module.pcss';
import { useDocumentsStore } from '../../../store/documet/document.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { ChangeEvent, useEffect } from 'react';
import FileInput from './components/FileInput/FileInput.tsx';
import FileCard from './components/FileCard/FileCard.tsx';

export default function FileUploader() {
  const {
    files,
    error,
    isLoading,
    progress,
    uploadingFileIndex,
    addFiles,
    removeFile,
    uploadFile,
    cancelUpload,
    resetError
  } = useDocumentsStore(
    useShallow((state) => ({
      files: state.files,
      error: state.error,
      isLoading: state.isLoading,
      progress: state.progress,
      uploadingFileIndex: state.uploadingFileIndex,
      addFiles: state.addFiles,
      removeFile: state.removeFile,
      uploadFile: state.uploadFile,
      cancelUpload: state.cancelUpload,
      resetError: state.resetError
    }))
  );

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
    addFiles(selectedFiles);
    event.target.value = '';
  };

  return (
    <div className={styles.container}>
      <div className={styles.titleBlock}>
        <span>It's nearly the end :)</span>
      </div>
      <FileInput handleFileChange={handleFileChange} isLoading={isLoading} error={error} />

      {files.length > 0 && (
        <ul className={styles.fileContainer}>
          {files.map((file, index) => (
            <FileCard
              key={index}
              index={index}
              name={file.name}
              size={file.size}
              removeFile={() => removeFile(index)}
              uploadFile={() => uploadFile(index)}
              cancelUpload={cancelUpload}
              isLoading={isLoading && uploadingFileIndex === index}
              uploadingFileIndex={uploadingFileIndex}
              progress={progress}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

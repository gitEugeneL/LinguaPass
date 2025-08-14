import { Loader } from '@clients/shared';
import cn from 'classnames';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useDocumentStore, useStudentStore } from '../../../../../store';

import styles from './DocumetsCard.module.pcss';
import { File } from './UI';

export function DocumentsCard() {
  const { studentId } = useParams<{ studentId?: string | undefined }>();

  const { studentDetail, isLoading } = useStudentStore(
    useShallow((state) => ({
      studentDetail: state.studentDetail,
      isLoading: state.isLoading
    }))
  );

  const { fileNames, getFileNames, openFile, fileLoading } = useDocumentStore(
    useShallow((state) => ({
      fileNames: state.fileNames,
      getFileNames: state.getFileNames,
      openFile: state.openFile,
      fileLoading: state.isLoading
    }))
  );

  useEffect(() => {
    if (
      !isLoading &&
      studentDetail &&
      studentDetail.userId &&
      studentId &&
      studentId === studentDetail.accountId
    ) {
      getFileNames(studentDetail.userId);
    }
  }, [isLoading, getFileNames, studentId, studentDetail]);

  const handleDownload = (fileName: string) => {
    if (studentDetail && studentDetail.userId) {
      openFile(studentDetail.userId, fileName);
    }
  };

  return (
    <ul
      className={cn(styles.card, {
        [styles.cardTest]: !isLoading && !fileLoading
      })}
    >
      {isLoading || fileLoading ? (
        <div className={styles.info}>
          <Loader color='secondary' />
        </div>
      ) : null}

      {!isLoading && !fileLoading && (
        <div className={styles.wrapper}>
          {!isLoading && !fileLoading && fileNames && fileNames.length === 0 && (
            <div className={styles.info}>Any files yet... 😔</div>
          )}

          {!isLoading &&
            fileNames &&
            fileNames.length > 0 &&
            fileNames.map((fileName, index) => (
              <File key={index} name={fileName} handleClick={handleDownload} />
            ))}
        </div>
      )}
    </ul>
  );
}

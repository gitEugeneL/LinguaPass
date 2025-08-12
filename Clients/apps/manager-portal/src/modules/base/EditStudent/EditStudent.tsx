import { Button, LoaderIndicator } from '@clients/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useCourseStore, useLanguageStore, useSchoolStore, useStudentStore } from '../../../store';
import { StatusArea } from '../../../widgets';

import { StudyCard } from './componets';
import styles from './EditStudent.module.pcss';

export function EditStudent() {
  const { studentId } = useParams<{ studentId?: string | undefined }>();

  const { studentDetail, getStudentDetail, isLoading } = useStudentStore(
    useShallow((state) => ({
      studentDetail: state.studentDetail,
      getStudentDetail: state.getStudentDetail,
      isLoading: state.isLoading
    }))
  );

  const getLanguageById = useLanguageStore((state) => state.getLanguageById);
  const getSchoolById = useSchoolStore((state) => state.getSchoolById);
  const getCourseById = useCourseStore((state) => state.getCourseById);

  useEffect(() => {
    if (studentId) {
      getStudentDetail(studentId);
    }
  }, [studentId, getStudentDetail]);

  useEffect(() => {
    if (studentDetail && studentDetail.courseId && !isLoading) {
      getCourseById(studentDetail.courseId);
    }
  }, [studentDetail, getCourseById, isLoading]);

  useEffect(() => {
    if (studentDetail && studentDetail.schoolId && !isLoading) {
      getSchoolById(studentDetail.schoolId);
    }
  }, [studentDetail, getSchoolById, isLoading]);

  useEffect(() => {
    if (studentDetail && studentDetail.languageId && !isLoading) {
      getLanguageById(studentDetail.languageId);
    }
  }, [studentDetail, getLanguageById, isLoading]);

  return (
    <>
      <StatusArea
        name={
          !isLoading && studentDetail?.contact?.name && studentDetail.contact.surname
            ? studentDetail.contact.name + ' ' + studentDetail.contact.surname
            : 'New student'
        }
      >
        {studentDetail?.isActive && (
          <Button name='Archive account' appearance='danger' size='small' />
        )}
      </StatusArea>

      <div className={styles.container}>
        {isLoading && <LoaderIndicator width={150} height={150} />}

        {!isLoading && studentDetail && <StudyCard />}
      </div>
    </>
  );
}

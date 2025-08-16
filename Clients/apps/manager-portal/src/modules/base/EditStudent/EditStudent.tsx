import { Button, formatElapsedTime, Notification, Stepper } from '@clients/shared';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import {
  useCourseStore,
  useLanguageStore,
  useProgressStore,
  useSchoolStore,
  useStudentStore
} from '../../../store';
import { StatusArea } from '../../../widgets';
import { KeyValueBlock } from '../../../widgets/StatusArea/UI';

import { DocumentsCard, InteractionCard, StudyCard } from './componets';
import styles from './EditStudent.module.pcss';
import { InfoBlock } from './widgets';

export function EditStudent() {
  const { studentId } = useParams<{ studentId?: string | undefined }>();

  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const [elapsedTime, setElapsedTime] = useState<string>('');

  const { studentDetail, getStudentDetail, toggleActive, error, resetError, isLoading } =
    useStudentStore(
      useShallow((state) => ({
        studentDetail: state.studentDetail,
        getStudentDetail: state.getStudentDetail,
        toggleActive: state.toggleActive,
        isLoading: state.isLoading,
        error: state.error,
        resetError: state.resetError
      }))
    );

  const { studentStatuses, getStudentStatus, statusLoading } = useProgressStore(
    useShallow((state) => ({
      studentStatuses: state.studentStatuses,
      getStudentStatus: state.getStudentStatus,
      statusLoading: state.isLoading
    }))
  );

  const getLanguageById = useLanguageStore((state) => state.getLanguageById);
  const getSchoolById = useSchoolStore((state) => state.getSchoolById);
  const getCourseById = useCourseStore((state) => state.getCourseById);

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => {
        setLocalError(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
    resetError();
  }, [error, resetError]);

  useEffect(() => {
    if (studentDetail?.updatedAt) {
      setElapsedTime(formatElapsedTime(new Date(studentDetail?.updatedAt)));
    }
  }, [studentDetail?.updatedAt]);

  useEffect(() => {
    if (
      !isLoading &&
      studentDetail &&
      studentDetail.userId &&
      studentDetail.accountId === studentId
    ) {
      getStudentStatus(studentDetail.userId);
    }
  }, [getStudentStatus, isLoading, studentDetail, studentId]);

  useEffect(() => {
    if (studentId) {
      getStudentDetail(studentId);
    }
  }, [studentId, getStudentDetail]);

  useEffect(() => {
    if (studentDetail && studentDetail.courseId && !isLoading) {
      getCourseById(studentDetail.courseId);
    }
  }, [getCourseById, isLoading, studentDetail]);

  useEffect(() => {
    if (studentDetail && studentDetail.schoolId && !isLoading) {
      getSchoolById(studentDetail.schoolId);
    }
  }, [getSchoolById, isLoading, studentDetail]);

  useEffect(() => {
    if (studentDetail && studentDetail.languageId && !isLoading) {
      getLanguageById(studentDetail.languageId);
    }
  }, [getLanguageById, isLoading, studentDetail]);

  const handleRefresh = () => {
    if (studentId) {
      getStudentDetail(studentId);
    }
  };

  const handleToggleActive = async () => {
    if (studentDetail && studentDetail.userId && !isLoading) {
      try {
        await toggleActive(studentDetail.accountId, !studentDetail.isActive);
      } catch (error) {}
    }
  };

  return (
    <div className={styles.main}>
      <StatusArea
        name={
          !isLoading
            ? studentDetail?.contact?.name && studentDetail.contact.surname
              ? studentDetail.contact.name + ' ' + studentDetail.contact.surname
              : 'New student'
            : ''
        }
      >
        {studentDetail?.isActive && (
          <div className={styles.info}>
            <KeyValueBlock name='Student upd' value={elapsedTime} />
          </div>
        )}

        {studentDetail?.isActive && (
          <div className={styles.btnWrapper}>
            {studentDetail.isActive && (
              <>
                <Button name='Refresh' size='small' onClick={handleRefresh} />
                <Button
                  name='Archive'
                  appearance='danger'
                  size='small'
                  isLoading={isLoading}
                  onClick={handleToggleActive}
                />
              </>
            )}
          </div>
        )}
        {!studentDetail?.isActive && (
          <Button
            name='Activate'
            appearance='primary'
            size='small'
            isLoading={isLoading}
            onClick={handleToggleActive}
          />
        )}
      </StatusArea>

      <div className={styles.wrapper}>
        <div className={styles.notification}>
          <Notification message={localError} />
        </div>
        <div
          className={cn(styles.container, {
            [styles.error]: localError
          })}
        >
          <div className={styles.mainWrapper}>
            {<StudyCard />}
            {<DocumentsCard />}
          </div>

          <InfoBlock />

          <Stepper isLoading={statusLoading} statuses={studentStatuses} />

          <InteractionCard changeActive={handleToggleActive} />
        </div>
      </div>
    </div>
  );
}

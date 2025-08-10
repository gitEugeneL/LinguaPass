import { Button } from '@clients/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useCourseStore, useSchoolStore } from '../../../store';
import { StatusArea } from '../../../widgets';

import styles from './AddEditCourse.module.pcss';
import { AddEditCourseForm } from './widgets';

export function AddEditCourse() {
  const { schoolId } = useParams<{ schoolId?: string | undefined }>();
  const { courseId } = useParams<{ courseId?: string | undefined }>();

  const { currentCourse, getCourseById } = useCourseStore(
    useShallow((state) => ({
      currentCourse: state.currentCourse,
      getCourseById: state.getCourseById
    }))
  );

  const { currentSchool, getSchoolById } = useSchoolStore(
    useShallow((state) => ({
      currentSchool: state.currentSchool,
      getSchoolById: state.getSchoolById
    }))
  );

  useEffect(() => {
    if (
      (schoolId &&
        currentCourse &&
        currentSchool &&
        currentCourse.schoolId !== currentSchool.schoolId) ||
      (schoolId && !currentSchool)
    ) {
      getSchoolById(schoolId);
    }
  }, [currentCourse, schoolId, getSchoolById, currentSchool]);

  useEffect(() => {
    if (courseId) {
      getCourseById(courseId);
    }
  }, [courseId, getCourseById]);

  return (
    <>
      {currentCourse && courseId && (
        <StatusArea name={currentCourse.name}>
          <div className={styles.wrapper}>
            <Button name='Disable' appearance='secondaryDanger' size='small' />
            <Button name='Delete' appearance='danger' size='small' />
          </div>
        </StatusArea>
      )}

      {!courseId && (
        <StatusArea name='Create new course'>
          {currentSchool && <span className={styles.schoolName}>{currentSchool.name}</span>}
        </StatusArea>
      )}

      <AddEditCourseForm courseId={courseId} />
    </>
  );
}

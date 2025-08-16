import { Button } from '@clients/shared';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useCourseStore, useSchoolStore } from '../../../store';
import { StatusArea } from '../../../widgets';

import styles from './AddEditCourse.module.pcss';
import { AddEditCourseForm } from './widgets';

export function AddEditCourse() {
  const { schoolId } = useParams<{ schoolId?: string | undefined }>();
  const { courseId } = useParams<{ courseId?: string | undefined }>();

  const navigate = useNavigate();

  const { currentCourse, getCourseById, deleteCountry, toggleActive, isLoading } = useCourseStore(
    useShallow((state) => ({
      currentCourse: state.currentCourse,
      isLoading: state.isLoading,
      toggleActive: state.toggleActive,
      deleteCountry: state.deleteCountry,
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

  const handleToggleActive = async () => {
    if (currentCourse && !isLoading) {
      try {
        await toggleActive(currentCourse.courseId, currentCourse.schoolId, !currentCourse.isActive);
        await getCourseById(currentCourse.courseId);
      } catch (error) {}
    }
  };

  const handleDelete = async () => {
    if (currentCourse && !isLoading) {
      try {
        await deleteCountry(currentCourse.courseId);
        navigate(`/programs/courses/${currentCourse.schoolId}`);
      } catch (error) {}
    }
  };

  return (
    <>
      {currentCourse && courseId && (
        <StatusArea name={currentCourse.name}>
          <div className={styles.wrapper}>
            {currentCourse.isActive && (
              <Button
                name='Disable'
                appearance='secondaryDanger'
                size='small'
                onClick={handleToggleActive}
                isLoading={isLoading}
              />
            )}
            {!currentCourse.isActive && (
              <Button
                name='Activate'
                appearance='primary'
                size='small'
                onClick={handleToggleActive}
                isLoading={isLoading}
              />
            )}
            <Button
              name='Delete'
              appearance='danger'
              size='small'
              onClick={handleDelete}
              isLoading={isLoading}
            />
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

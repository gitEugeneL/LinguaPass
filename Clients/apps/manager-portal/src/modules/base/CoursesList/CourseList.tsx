import { Button, LoaderIndicator } from '@clients/shared';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { EmptyCard, ItemCard } from '../../../componets';
import { useCourseStore, useSchoolStore } from '../../../store';
import { StatusArea } from '../../../widgets';
import { KeyValueBlock } from '../../../widgets/StatusArea/UI';

import styles from './CourseList.module.pcss';

export function CourseList() {
  const { schoolId } = useParams<{ schoolId?: string | undefined }>();
  const navigate = useNavigate();

  const { currentSchool, getSchoolById } = useSchoolStore(
    useShallow((state) => ({
      currentSchool: state.currentSchool,
      getSchoolById: state.getSchoolById
    }))
  );

  const { courses, getCoursesBySchoolId, isLoading } = useCourseStore(
    useShallow((state) => ({
      courses: state.courses,
      getCoursesBySchoolId: state.getCoursesBySchoolId,
      isLoading: state.isLoading
    }))
  );

  useEffect(() => {
    if (schoolId && courses && !isLoading) {
      getCoursesBySchoolId(schoolId);
    }
  }, []);

  useEffect(() => {
    if (schoolId) {
      getSchoolById(schoolId);
    }
  }, [schoolId, getSchoolById]);

  const handleCreate = () => {
    navigate(`/programs/courses/add-edit/${schoolId}`);
  };

  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      return 0;
    });
  }, [courses]);

  return (
    <>
      {currentSchool && schoolId && (
        <>
          <StatusArea name={currentSchool.name}>
            <div className={styles.info}>
              <KeyValueBlock name='total' value={courses.length.toString()} />
              <KeyValueBlock
                name='active'
                value={courses.filter((course) => course.isActive).length.toString()}
              />
              <KeyValueBlock
                name='disabled'
                value={courses.filter((course) => !course.isActive).length.toString()}
              />
            </div>
            <Button name='Create' size='small' onClick={handleCreate} />
          </StatusArea>

          <div className={styles.container}>
            {isLoading && <LoaderIndicator width={150} height={150} />}

            {!isLoading &&
              sortedCourses.length > 0 &&
              sortedCourses.map((course) => (
                <ItemCard
                  key={course.courseId}
                  parentId={course.schoolId}
                  parentName={course.schoolName}
                  itemId={course.courseId}
                  name={course.name}
                  isActiveStatus={course.isActive}
                  appearance='course'
                  country={course.countryName}
                  city={course.location}
                  languages={[course.languageName]}
                />
              ))}

            {!isLoading && courses && (
              <EmptyCard name='Create new course' onClick={handleCreate} appearance='big' />
            )}
          </div>
        </>
      )}
    </>
  );
}

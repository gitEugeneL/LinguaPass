import { LoaderIndicator } from '@clients/shared';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import {
  type Language,
  useCourseStore,
  useLanguageStore,
  useSchoolStore,
  useStudentStore
} from '../../../../../store';
import type { CourseResponse } from '../../../../../store/course/course.models.ts';
import type { SchoolResponse } from '../../../../../store/school/school.models.ts';
import { LanguageIcon } from '../../../../../UI';

import styles from './StudyCard.module.pcss';

export function StudyCard() {
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);
  const [currentSchool, setCurrentSchool] = useState<SchoolResponse | null>(null);
  const [currentCourse, setCurrentCourse] = useState<CourseResponse | null>(null);

  const { studentDetail, isLoading } = useStudentStore(
    useShallow((state) => ({
      studentDetail: state.studentDetail,
      isLoading: state.isLoading
    }))
  );

  const languages = useLanguageStore((state) => state.languages);
  const schools = useSchoolStore((state) => state.schools);
  const courses = useCourseStore((state) => state.courses);

  useEffect(() => {
    if (!isLoading && studentDetail && studentDetail.courseId) {
      const currentCourse = courses.find((course) => course.courseId === studentDetail.courseId);
      if (currentCourse) {
        setCurrentCourse(currentCourse);
      }
    } else if (studentDetail && !studentDetail.courseId) {
      setCurrentCourse(null);
    }
  }, [courses, isLoading, studentDetail]);

  useEffect(() => {
    if (!isLoading && studentDetail && studentDetail.schoolId) {
      const currentSchool = schools.find((school) => school.schoolId === studentDetail.schoolId);
      if (currentSchool) {
        setCurrentSchool(currentSchool);
      }
    } else if (studentDetail && !studentDetail.schoolId) {
      setCurrentSchool(null);
    }
  }, [isLoading, schools, studentDetail]);

  useEffect(() => {
    if (!isLoading && studentDetail && studentDetail.languageId) {
      const currentLanguage = languages.find(
        (language) => language.languageId === studentDetail.languageId
      );
      if (currentLanguage) {
        setCurrentLanguage(currentLanguage);
      }
    }
  }, [languages, studentDetail, isLoading]);

  return (
    <div className={styles.card}>
      {isLoading && (
        <div className={styles.loader}>
          <LoaderIndicator color='secondary' width={100} height={100} />
        </div>
      )}

      {!isLoading && (
        <>
          <div className={styles.mainWrapper}>
            {studentDetail && !studentDetail.languageId && (
              <span className={styles.program}>Program not yet selected</span>
            )}
            {currentLanguage && (
              <div className={styles.language}>
                <LanguageIcon name={currentLanguage.name} isSingle={true} />
              </div>
            )}
            <div className={styles.countryWrapper}>
              <span className={styles.country}>
                {currentSchool ? currentSchool.countryName : '-'}
              </span>
              <span className={styles.city}>{currentSchool ? currentSchool.city : '-'}</span>
            </div>
          </div>
          <div className={styles.titleWrapper}>
            <h3 className={styles.courseName}>
              {currentCourse?.name ? currentCourse.name : 'Course not yet selected'}
            </h3>
            <span className={styles.schoolName}>
              {currentSchool?.name ? currentSchool.name : 'School not yet selected'}
            </span>
          </div>
          <div className={styles.infoWrapper}>
            <div className={styles.wrapper}>
              <div className={styles.infoTitle}>
                Duration:{' '}
                <span className={styles.info}>{currentCourse ? currentCourse.duration : '-'}</span>
              </div>
              <div className={styles.infoTitle}>
                Accommodation:{' '}
                <span className={styles.info}>
                  {currentCourse ? (currentCourse.withAccommodation ? 'yes' : 'no') : '-'}
                </span>
              </div>
            </div>
            <div className={styles.wrapper}>
              <div className={styles.infoTitle}>
                Admission:{' '}
                <span className={styles.info}>
                  {currentCourse ? `${currentCourse.admissionFee.toString()}€` : '-'}
                </span>
              </div>
              <div className={styles.infoTitle}>
                Price:{' '}
                <span className={styles.info}>
                  {currentCourse ? `${currentCourse.price.toString()}€` : '-'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { dateTimeToShortString } from '@clients/shared';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { type Language, useLanguageStore, useSchoolStore } from '../../../../../store';
import type { SchoolResponse } from '../../../../../store/school/school.models.ts';
import { LanguageIcon } from '../../../../../UI';

import styles from './StudentCard.module.pcss';
import type { StudentCardProps } from './StudentCard.props.ts';

export function StudentCard({ ...props }: StudentCardProps) {
  const [currentSchool, setCurrentSchool] = useState<SchoolResponse | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language | null>(null);

  const { languages, getLanguageById } = useLanguageStore(
    useShallow((state) => ({
      languages: state.languages,
      getLanguageById: state.getLanguageById
    }))
  );

  const { schools, getSchoolById } = useSchoolStore(
    useShallow((state) => ({
      schools: state.schools,
      getSchoolById: state.getSchoolById
    }))
  );

  useEffect(() => {
    if (props.schoolId && schools) {
      const currentSchool = schools.find((school) => school.schoolId === props.schoolId);
      if (currentSchool) {
        setCurrentSchool(currentSchool);
      }
    }
  }, [props.schoolId, schools]);

  useEffect(() => {
    const currentLanguage = languages.find((language) => language.languageId === props.languageId);
    if (props.languageId && currentLanguage) {
      setCurrentLanguage(currentLanguage);
    }
  }, [languages, props.languageId]);

  useEffect(() => {
    if (props.schoolId) {
      getSchoolById(props.schoolId);
    }
  }, [props.schoolId]);

  useEffect(() => {
    if (props.languageId) {
      getLanguageById(props.languageId);
    }
  }, [props.languageId]);

  return (
    <div className={styles.card}>
      <div className={styles.wrapper}>
        <div className={styles.date}>{dateTimeToShortString(props.updatedAt.toString())}</div>

        {!props.schoolId || !currentSchool ? (
          <span className={styles.notComplete}>in process...</span>
        ) : null}

        {props.schoolId && currentSchool && (
          <div className={styles.locationWrapper}>
            <span className={styles.country}>{currentSchool.countryName}</span>
            <span className={styles.city}>{currentSchool.city}</span>
          </div>
        )}
      </div>

      <h3 className={styles.name}>
        {props.name && props.surname ? `${props.name} ${props.surname}` : 'New student in process'}
      </h3>
      <span className={styles.schoolName}>
        {props.schoolId && currentSchool ? currentSchool.name : 'School not yet selected'}
      </span>

      {!props.languageId && <span className={styles.program}>Program not yet selected</span>}
      {props.languageId && currentLanguage && (
        <div className={styles.language}>
          <LanguageIcon name={currentLanguage.name} isSingle={true} />
        </div>
      )}
    </div>
  );
}

import { Button } from '@clients/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useCountryStore, useSchoolStore } from '../../../store';
import { StatusArea } from '../../../widgets';

import styles from './AddEditSchool.module.pcss';
import { AddEditSchoolForm } from './widgets';

export function AddEditSchool() {
  const { countryId } = useParams<{ countryId?: string | undefined }>();
  const { schoolId } = useParams<{ schoolId?: string | undefined }>();

  const { currentSchool, getSchoolById } = useSchoolStore(
    useShallow((state) => ({
      currentSchool: state.currentSchool,
      getSchoolById: state.getSchoolById
    }))
  );

  const { currentCountry, getCountryById } = useCountryStore(
    useShallow((state) => ({
      currentCountry: state.currentCountry,
      getCountryById: state.getCountryById
    }))
  );

  useEffect(() => {
    if (
      (countryId &&
        currentSchool &&
        currentCountry &&
        currentSchool.countryId !== currentCountry.countryId) ||
      (countryId && !currentCountry)
    ) {
      getCountryById(countryId);
    }
  }, [currentSchool, countryId, getCountryById, currentCountry]);

  useEffect(() => {
    if (schoolId) {
      getSchoolById(schoolId);
    }
  }, [schoolId, getSchoolById]);

  return (
    <>
      {currentSchool && schoolId && (
        <StatusArea name={currentSchool.name}>
          <div className={styles.wrapper}>
            <Button name='Disable' appearance='secondaryDanger' size='small' />
            <Button name='Delete' appearance='danger' size='small' />
          </div>
        </StatusArea>
      )}
      {!schoolId && (
        <StatusArea name='Create new school'>
          {currentCountry && <span className={styles.country}>{currentCountry.name}</span>}
        </StatusArea>
      )}

      {<AddEditSchoolForm schoolId={schoolId} />}
    </>
  );
}

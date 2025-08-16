import { Button } from '@clients/shared';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useCountryStore, useSchoolStore } from '../../../store';
import { StatusArea } from '../../../widgets';

import styles from './AddEditSchool.module.pcss';
import { AddEditSchoolForm } from './widgets';

export function AddEditSchool() {
  const { countryId } = useParams<{ countryId?: string | undefined }>();
  const { schoolId } = useParams<{ schoolId?: string | undefined }>();

  const navigate = useNavigate();

  const { currentSchool, getSchoolById, toggleActive, deleteSchool, isLoading } = useSchoolStore(
    useShallow((state) => ({
      currentSchool: state.currentSchool,
      isLoading: state.isLoading,
      toggleActive: state.toggleActive,
      deleteSchool: state.deleteSchool,
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

  const handleToggleActive = async () => {
    if (currentSchool && !isLoading) {
      try {
        await toggleActive(
          currentSchool.schoolId,
          currentSchool.countryId,
          currentSchool.languages.map((language) => language.languageId),
          !currentSchool.isActive
        );
        await getSchoolById(currentSchool.schoolId);
      } catch (error) {}
    }
  };

  const handleDelete = async () => {
    if (currentSchool && !isLoading) {
      try {
        await deleteSchool(currentSchool.schoolId);
        navigate(`/programs/schools/${currentSchool.countryId}`);
      } catch (error) {}
    }
  };

  return (
    <>
      {currentSchool && schoolId && (
        <StatusArea name={currentSchool.name}>
          <div className={styles.wrapper}>
            {currentSchool.isActive && (
              <Button
                name='Disable'
                appearance='secondaryDanger'
                size='small'
                onClick={handleToggleActive}
                isLoading={isLoading}
              />
            )}
            {!currentSchool.isActive && (
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
      {!schoolId && (
        <StatusArea name='Create new school'>
          {currentCountry && <span className={styles.country}>{currentCountry.name}</span>}
        </StatusArea>
      )}

      {<AddEditSchoolForm schoolId={schoolId} />}
    </>
  );
}

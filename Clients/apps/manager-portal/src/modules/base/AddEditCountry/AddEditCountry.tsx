import { Button } from '@clients/shared';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useCountryStore } from '../../../store';
import { StatusArea } from '../../../widgets';

import styles from './AddEditCountry.module.pcss';
import { AddEditCountryForm } from './widgets';

export function AddEditCountry() {
  const { countryId } = useParams<{ countryId?: string | undefined }>();

  const navigate = useNavigate();

  const { currentCountry, getCountryById, toggleActive, deleteCountry, isLoading } =
    useCountryStore(
      useShallow((state) => ({
        currentCountry: state.currentCountry,
        getCountryById: state.getCountryById,
        toggleActive: state.toggleActive,
        isLoading: state.isLoading,
        deleteCountry: state.deleteCountry
      }))
    );

  useEffect(() => {
    if (countryId) {
      getCountryById(countryId);
    }
  }, [countryId, getCountryById]);

  const handleToggleActive = async () => {
    if (currentCountry && !isLoading) {
      try {
        await toggleActive(currentCountry.countryId, !currentCountry.isActive);
        await getCountryById(currentCountry.countryId);
      } catch (error) {}
    }
  };

  const handleDelete = async () => {
    if (currentCountry && !isLoading) {
      try {
        await deleteCountry(currentCountry.countryId);
        navigate('/programs/countries');
      } catch (error) {}
    }
  };

  return (
    <>
      {currentCountry && countryId && (
        <StatusArea name={currentCountry.name}>
          <div className={styles.wrapper}>
            {currentCountry.isActive && (
              <Button
                name='Disable'
                appearance='secondaryDanger'
                size='small'
                onClick={handleToggleActive}
                isLoading={isLoading}
              />
            )}
            {!currentCountry.isActive && (
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
      {!countryId && <StatusArea name='Create new country' />}
      <AddEditCountryForm countryId={countryId} />
    </>
  );
}

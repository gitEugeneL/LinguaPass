import { Button } from '@clients/shared';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useCountryStore } from '../../../store';
import { StatusArea } from '../../../widgets';

import styles from './AddEditCountry.module.pcss';
import { AddEditCountryForm } from './widgets';

export function AddEditCountry() {
  const { countryId } = useParams<{ countryId?: string | undefined }>();

  const { currentCountry, getCountryById } = useCountryStore(
    useShallow((state) => ({
      currentCountry: state.currentCountry,
      getCountryById: state.getCountryById
    }))
  );

  useEffect(() => {
    if (countryId) {
      getCountryById(countryId);
    }
  }, [countryId, getCountryById]);

  return (
    <>
      {currentCountry && countryId && (
        <StatusArea name={currentCountry.name}>
          <div className={styles.wrapper}>
            <Button name='Disable' appearance='secondaryDanger' size='small' />
            <Button name='Delete' appearance='danger' size='small' />
          </div>
        </StatusArea>
      )}
      {!countryId && <StatusArea name='Create new country' />}
      <AddEditCountryForm countryId={countryId} />
    </>
  );
}

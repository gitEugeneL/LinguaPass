import { Button } from '@clients/shared';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useCountryStore } from '../../../store';
import { StatusArea } from '../../../widgets';

export function AddEditCountry() {
  const { countryId } = useParams<{ countryId?: string }>();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const { currentCountry, isLoading, getCountryById } = useCountryStore(
    useShallow((state) => ({
      currentCountry: state.currentCountry,
      isLoading: state.isLoading,
      getCountryById: state.getCountryById
    }))
  );

  useEffect(() => {
    if (countryId) {
      setIsEditMode(true);
    }
  }, [countryId]);

  useEffect(() => {
    if (isEditMode && countryId) {
      getCountryById(countryId);
    }
  }, [isEditMode]);

  return (
    <>
      {isEditMode && currentCountry && !isLoading && (
        <StatusArea name={currentCountry.name}>
          <Button name='Disable' appearance='secondaryDanger' size='small' />
          <Button name='Delete' appearance='danger' size='small' />
        </StatusArea>
      )}

      {!isEditMode && !isLoading && <StatusArea name='Create new country'></StatusArea>}
    </>
  );
}

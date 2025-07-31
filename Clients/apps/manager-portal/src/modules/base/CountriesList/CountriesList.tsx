import { Button, LoaderIndicator } from '@clients/shared';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { EmptyCard, ItemCard } from '../../../componets';
import { useCountryStore } from '../../../store';
import { StatusArea } from '../../../widgets';
import { KeyValueBlock } from '../../../widgets/StatusArea/UI';

import styles from './CountriesList.module.pcss';

export function CountriesList() {
  const navigate = useNavigate();
  const location = useLocation();

  const { countries, isLoading, getAllCountries } = useCountryStore(
    useShallow((state) => ({
      countries: state.countries,
      isLoading: state.isLoading,
      getAllCountries: state.getAllCountries
    }))
  );

  useEffect(() => {
    if (countries && countries.length === 0 && !isLoading) {
      getAllCountries();
    }
  }, []);

  const handleCreate = () => {
    navigate(`${location.pathname}/add-edit`);
  };

  const sortedCountries = useMemo(() => {
    return [...countries].sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      return (b.schoolsCount || 0) - (a.schoolsCount || 0);
    });
  }, [countries]);

  return (
    <>
      <StatusArea name='Countries'>
        <div className={styles.info}>
          <KeyValueBlock name='total' value={countries.length.toString()} />
          <KeyValueBlock
            name='active'
            value={countries.filter((country) => country.isActive).length.toString()}
          />
          <KeyValueBlock
            name='disabled'
            value={countries.filter((country) => !country.isActive).length.toString()}
          />
        </div>
        <Button name='Create' size='small' onClick={handleCreate} />
      </StatusArea>

      <div className={styles.container}>
        {isLoading && <LoaderIndicator width={150} height={150} />}

        {!isLoading &&
          sortedCountries.length > 0 &&
          sortedCountries.map((country) => (
            <ItemCard
              key={country.countryId}
              itemId={country.countryId}
              name={country.name}
              isActiveStatus={country.isActive}
              elemCount={country.schoolsCount}
            />
          ))}

        {!isLoading && <EmptyCard name='Create new country' onClick={handleCreate} />}
      </div>
    </>
  );
}

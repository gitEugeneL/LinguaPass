import { Button, LoaderIndicator } from '@clients/shared';
import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { EmptyCard, ItemCard } from '../../../componets';
import { useCountryStore, useSchoolStore } from '../../../store';
import { StatusArea } from '../../../widgets';
import { KeyValueBlock } from '../../../widgets/StatusArea/UI';

import styles from './SchoolsList.module.pcss';

export function SchoolsList() {
  const { countryId } = useParams<{ countryId?: string | undefined }>();
  const navigate = useNavigate();

  const { currentCountry, getCountryById } = useCountryStore(
    useShallow((state) => ({
      currentCountry: state.currentCountry,
      getCountryById: state.getCountryById
    }))
  );

  const { schools, getSchoolsByCountryId, isLoading } = useSchoolStore(
    useShallow((state) => ({
      schools: state.schools,
      isLoading: state.isLoading,
      getSchoolsByCountryId: state.getSchoolsByCountryId
    }))
  );

  useEffect(() => {
    if (countryId && schools && !isLoading) {
      getSchoolsByCountryId(countryId);
    }
  }, []);

  useEffect(() => {
    if (countryId) {
      getCountryById(countryId);
    }
  }, [countryId, getCountryById]);

  const handleCreate = () => {
    navigate(`/programs/schools/add-edit/${countryId}`);
  };

  const sortedSchools = useMemo(() => {
    return [...schools].sort((a, b) => {
      if (a.isActive !== b.isActive) {
        return a.isActive ? -1 : 1;
      }
      return (b.tracksCount || 0) - (a.tracksCount || 0);
    });
  }, [schools]);

  return (
    <>
      {currentCountry && countryId && (
        <>
          <StatusArea name={currentCountry.name}>
            <div className={styles.info}>
              <KeyValueBlock name='total' value={schools.length.toString()} />
              <KeyValueBlock
                name='active'
                value={schools.filter((school) => school.isActive).length.toString()}
              />
              <KeyValueBlock
                name='disabled'
                value={schools.filter((school) => !school.isActive).length.toString()}
              />
            </div>
            <Button name='Create' size='small' onClick={handleCreate} />
          </StatusArea>

          <div className={styles.container}>
            {isLoading && <LoaderIndicator width={150} height={150} />}

            {!isLoading &&
              sortedSchools.length > 0 &&
              sortedSchools.map((school) => (
                <ItemCard
                  parentId={school.countryId}
                  appearance='school'
                  key={school.schoolId}
                  itemId={school.schoolId}
                  name={school.name}
                  isActiveStatus={school.isActive}
                  elemCount={school.tracksCount}
                  country={currentCountry.name}
                  city={school.city}
                  languages={school.languages.map((language) => language.name)}
                />
              ))}

            {!isLoading && schools && (
              <EmptyCard name='Create new school' onClick={handleCreate} appearance='big' />
            )}
          </div>
        </>
      )}
    </>
  );
}

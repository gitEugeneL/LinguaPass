import styles from './SchoolList.module.pcss';
import SchoolWidget from './widgets/SchoolWidget/SchoolWidget.tsx';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { useLanguagesStore } from '../../../store/language/language.store.ts';
import { useSchoolsStore } from '../../../store/school/school.store.ts';
import { useEffect } from 'react';
import { routes } from '../../../helpers/routeHelpers.ts';
import Loader from '../../../components/base/Loader/Loader.tsx';

export default function SchoolList() {
  const { myStatus, changeStep } = useProgressStore(
    useShallow((state) => ({
      myStatus: state.myStatus,
      changeStep: state.changeStep
    }))
  );

  const { myLanguageId, getMyLanguage, isLoadingLanguages } = useLanguagesStore(
    useShallow((state) => ({
      isLoadingLanguages: state.isLoading,
      myLanguageId: state.myLanguageId,
      getMyLanguage: state.getMyLanguage
    }))
  );

  const { countries, countriesLanguageId, getCountries, isLoadingSchools } = useSchoolsStore(
    useShallow((state) => ({
      isLoadingSchools: state.isLoading,
      countries: state.countries,
      countriesLanguageId: state.countriesLanguageId,
      getCountries: state.getCountries
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      if (myStatus && myStatus.order > routes.language.order) {
        if (!myLanguageId) {
          await getMyLanguage();
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const hasLanguageId = !!myLanguageId;
      const hasNoCountries = countries.length === 0;
      const languageMismatch = countriesLanguageId !== myLanguageId;

      if (hasLanguageId && (hasNoCountries || languageMismatch)) {
        await getCountries(myLanguageId);
      }
    };
    fetchData();
  }, [myLanguageId]);

  return (
    <ul className={styles.container}>
      {(isLoadingSchools || isLoadingLanguages) && <Loader />}
      {!isLoadingLanguages &&
        !isLoadingSchools &&
        countries.map((country) => (
          <SchoolWidget
            key={country.countryId}
            name={country.name}
            schoolsCount={country.schoolsCount}
          />
        ))}
    </ul>
  );
}

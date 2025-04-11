import styles from './SchoolList.module.pcss';
import SchoolWidget from './widgets/SchoolWidget/SchoolWidget.tsx';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { useLanguagesStore } from '../../../store/language/language.store.ts';
import { useEffect, useState } from 'react';
import { routes } from '../../../helpers/routeHelpers.ts';
import { useSchoolsStore } from '../../../store/school/school.store.ts';

export default function SchoolList() {
  const [openedCountryId, setOpenedCountryId] = useState<string | null>(null);

  const myStatus = useProgressStore((state) => state.myStatus);

  const { myLanguageId, getMyLanguage } = useLanguagesStore(
    useShallow((state) => ({
      myLanguageId: state.myLanguageId,
      getMyLanguage: state.getMyLanguage
    }))
  );

  const { countries, currentLanguageId, getCountries } = useSchoolsStore(
    useShallow((state) => ({
      countries: state.countries,
      currentLanguageId: state.currentLanguageId,
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
      const languageMismatch = currentLanguageId !== myLanguageId;

      if (hasLanguageId && (hasNoCountries || languageMismatch)) {
        await getCountries(myLanguageId);
      }
    };
    fetchData();
  }, [myLanguageId]);

  const handleWidgetClick = (countryId: string) => {
    setOpenedCountryId((prev) => (prev === countryId ? null : countryId));
  };

  return (
    <ul className={styles.container}>
      {countries.length !== 0 &&
        countries.map((country) => (
          <SchoolWidget
            key={country.countryId}
            countryId={country.countryId}
            name={country.name}
            schoolsCount={country.schoolsCount}
            isOpened={openedCountryId === country.countryId}
            onClick={handleWidgetClick}
          />
        ))}
    </ul>
  );
}

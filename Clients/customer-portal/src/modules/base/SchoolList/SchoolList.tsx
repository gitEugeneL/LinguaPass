import styles from './SchoolList.module.pcss';
import SchoolWidget from './widgets/SchoolWidget/SchoolWidget.tsx';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { useLanguagesStore } from '../../../store/language/language.store.ts';
import { useEffect, useMemo, useState } from 'react';
import { routes } from '../../../helpers/routeHelpers.ts';
import { useSchoolsStore } from '../../../store/school/school.store.ts';
import { useNavigate } from 'react-router';
import Loader from '../../../components/base/Loader/Loader.tsx';

export default function SchoolList() {
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [openedCountryId, setOpenedCountryId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { myStatus, changeStep } = useProgressStore(
    useShallow((state) => ({
      myStatus: state.myStatus,
      changeStep: state.changeStep
    }))
  );

  const { currentLanguageId, getCurrentLanguage } = useLanguagesStore(
    useShallow((state) => ({
      currentLanguageId: state.currentLanguageId,
      getCurrentLanguage: state.getCurrentLanguage
    }))
  );

  const {
    isLoading,
    countries,
    schoolCurrentLanguageId,
    currentCountryId,
    currentSchoolId,
    currentSchool,
    getCountries,
    getCurrentSchool,
    getCurrentSchoolId,
    chooseSchool
  } = useSchoolsStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      countries: state.countries,
      currentCountryId: state.currentCountryId,
      schoolCurrentLanguageId: state.currentLanguageId,
      currentSchool: state.currentSchool,
      currentSchoolId: state.currentSchoolId,
      getCurrentSchoolId: state.getCurrentSchoolId,
      getCurrentSchool: state.getCurrentSchool,
      getCountries: state.getCountries,
      chooseSchool: state.chooseSchool
    }))
  );

  const sortedCountries = useMemo(() => {
    if (!currentCountryId) return countries;
    return [
      ...countries.filter((country) => country.countryId === currentCountryId),
      ...countries.filter((country) => country.countryId !== currentCountryId)
    ];
  }, [countries, currentCountryId]);

  useEffect(() => {
    const fetchData = async () => {
      if (myStatus && myStatus.order > routes.language.order) {
        if (!currentLanguageId) {
          setIsInitLoading(true);
          await getCurrentLanguage();
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const hasLanguageId = !!currentLanguageId;
      const hasNoCountries = countries.length === 0;
      const languageMismatch = schoolCurrentLanguageId !== currentLanguageId;

      if (hasLanguageId && (hasNoCountries || languageMismatch)) {
        setIsInitLoading(true);
        await getCountries(currentLanguageId).then(() => {
          setIsInitLoading(false);
        });
      }
    };
    fetchData();
  }, [currentLanguageId]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentSchoolId === null && myStatus !== null && myStatus.order >= routes.course.order) {
        await getCurrentSchoolId();
      }
      if (
        currentSchoolId !== null &&
        currentSchool === null &&
        myStatus !== null &&
        myStatus.order > routes.school.order
      ) {
        await getCurrentSchool();
      }
    };
    fetchData();
  }, [currentSchoolId]);

  const handleWidgetClick = (countryId: string) => {
    setOpenedCountryId((prev) => (prev === countryId ? null : countryId));
  };

  const handleChoose = async (schoolId: string, countryId: string) => {
    if (myStatus && myStatus.order >= routes.school.order && !isLoading) {
      await chooseSchool(schoolId, countryId).then(() => {
        changeStep(routes.course.order);
        navigate(routes.course.to);
      });
    }
  };

  return (
    <ul className={styles.container}>
      {isInitLoading && <Loader />}

      {!isInitLoading &&
        sortedCountries.length !== 0 &&
        sortedCountries.map((country) => (
          <SchoolWidget
            key={country.countryId}
            countryId={country.countryId}
            updateStatus={myStatus !== null && myStatus.order >= routes.course.order}
            name={country.name}
            schoolsCount={country.schoolsCount}
            isOpened={openedCountryId === country.countryId}
            onClick={handleWidgetClick}
            handleChoose={handleChoose}
          />
        ))}
    </ul>
  );
}

import styles from './SchoolList.module.pcss';
import SchoolWidget from './widgets/SchoolWidget/SchoolWidget.tsx';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useMemo, useState } from 'react';
import { routes } from '../../../helpers/routeHelpers.ts';
import { useSchoolsStore } from '../../../store/school/school.store.ts';
import { useNavigate } from 'react-router';
import Loader from '../../../components/base/Loader/Loader.tsx';
import { useAccountStore } from '../../../store/account/account.store.ts';

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

  const { account } = useAccountStore(
    useShallow((state) => ({
      account: state.account
    }))
  );

  const {
    isLoading,
    countries,
    currentCountryId,
    currentSchool,
    getCountries,
    getCurrentSchool,
    chooseSchool
  } = useSchoolsStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      countries: state.countries,
      currentCountryId: state.currentCountryId,
      currentSchool: state.currentSchool,
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
      if (account?.languageId) {
        setIsInitLoading(true);

        await getCountries(account.languageId).then(() => {
          setIsInitLoading(false);
        });
      }
    };
    fetchData();
  }, [account?.languageId]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        account?.schoolId !== null &&
        currentSchool === null &&
        myStatus !== null &&
        myStatus.order > routes.school.order
      ) {
        await getCurrentSchool();
      }
    };
    fetchData();
  }, [account?.schoolId]);

  const handleWidgetClick = (countryId: string) => {
    setOpenedCountryId((prev) => (prev === countryId ? null : countryId));
  };

  const handleChoose = async (schoolId: string, countryId: string) => {
    if (myStatus && myStatus.order >= routes.school.order && !isLoading) {
      await chooseSchool(schoolId, countryId).then(() => {
        changeStep(routes.course.order);
      });
    }
    navigate(routes.course.to);
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

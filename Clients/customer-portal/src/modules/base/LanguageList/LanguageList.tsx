import styles from './LanguageList.module.pcss';
import { useShallow } from 'zustand/react/shallow';
import LanguageCard from './components/LanguageCard/LanguageCard.tsx';
import { useLanguagesStore } from '../../../store/language/language.store.ts';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { routes } from '../../../helpers/routeHelpers.ts';
import Loader from '../../../components/base/Loader/Loader.tsx';

export default function LanguageList() {
  const [loadingLanguageId, setLoadingLanguageId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { myStatus, changeStep } = useProgressStore(
    useShallow((state) => ({
      myStatus: state.myStatus,
      changeStep: state.changeStep
    }))
  );
  const { languages, myLanguage, getActiveLanguages, getMyLanguage, isLoading, chooseLanguage } =
    useLanguagesStore(
      useShallow((state) => ({
        isLoading: state.isLoading,
        languages: state.languages,
        myLanguage: state.myLanguage,
        getMyLanguage: state.getMyLanguage,
        getActiveLanguages: state.getActiveLanguages,
        chooseLanguage: state.chooseLanguage
      }))
    );

  useEffect(() => {
    const fetchData = async () => {
      if (languages.length === 0) {
        await getActiveLanguages();
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (myStatus !== null && myLanguage === null && myStatus.order > routes.language.order) {
        await getMyLanguage();
      }
    };
    fetchData();
  }, [myLanguage]);

  const handleClick = async (languageId: string) => {
    if ((myStatus === null || languageId !== myLanguage?.languageId) && !isLoading) {
      setLoadingLanguageId(languageId);
      await chooseLanguage(languageId);
      changeStep(routes.school.order);
    }
    navigate(routes.school.to);
  };

  const sortedLanguages = [...languages].sort((a, b) => {
    if (myLanguage) {
      const aIsChosen = myLanguage.languageId === a.languageId;
      const bIsChosen = myLanguage.languageId === b.languageId;
      return aIsChosen ? -1 : bIsChosen ? 1 : 0;
    } else {
      return 0;
    }
  });

  if ((languages.length === 0 && isLoading) || (myLanguage === null && isLoading)) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      {sortedLanguages.length > 0 &&
        sortedLanguages.map((item) => (
          <LanguageCard
            key={item.languageId}
            title={item.name}
            description={item.description}
            isLoading={loadingLanguageId === item.languageId}
            handleClick={() => handleClick(item.languageId)}
            {...(myLanguage && {
              chosen: myLanguage.languageId === item.languageId
            })}
          />
        ))}
    </div>
  );
}

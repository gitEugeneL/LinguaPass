import styles from './LanguageList.module.pcss';
import { useShallow } from 'zustand/react/shallow';
import LanguageCard from './components/LanguageCard/LanguageCard.tsx';
import { useLanguagesStore } from '../../../store/language/language.store.ts';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { routes } from '../../../helpers/routeHelpers.ts';
import Loader from '../../../components/base/Loader/Loader.tsx';
import { useAccountStore } from '../../../store/account/account.store.ts';

export default function LanguageList() {
  const [loadingLanguageId, setLoadingLanguageId] = useState<string | null>(null);
  const navigate = useNavigate();

  const account = useAccountStore((state) => state.account);

  const { myStatus, changeStep } = useProgressStore(
    useShallow((state) => ({
      myStatus: state.myStatus,
      changeStep: state.changeStep
    }))
  );
  const {
    languages,
    currentLanguage,
    getLanguages,
    getCurrentLanguage,
    isLoading,
    chooseLanguage
  } = useLanguagesStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      languages: state.languages,
      currentLanguage: state.currentLanguage,
      getCurrentLanguage: state.getCurrentLanguage,
      getLanguages: state.getActiveLanguages,
      chooseLanguage: state.chooseLanguage
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      if (languages.length === 0) {
        await getLanguages();
      }
      const isStatusCorrect = myStatus && myStatus.order > routes.language.order;
      const languageId = account?.languageId;
      if (isStatusCorrect && languageId && currentLanguage === null) {
        await getCurrentLanguage(languageId);
      }
    };
    fetchData();
  }, []);

  const handleChoose = async (languageId: string) => {
    if ((myStatus === null || languageId !== currentLanguage?.languageId) && !isLoading) {
      setLoadingLanguageId(languageId);
      await chooseLanguage(languageId).then(() => {
        changeStep(routes.school.order);
      });
    }
    navigate(routes.school.to);
  };

  const sortedLanguages = [...languages].sort((a, b) => {
    if (currentLanguage) {
      const aIsChosen = currentLanguage.languageId === a.languageId;
      const bIsChosen = currentLanguage.languageId === b.languageId;
      return aIsChosen ? -1 : bIsChosen ? 1 : 0;
    } else {
      return 0;
    }
  });

  if ((languages.length === 0 && isLoading) || (currentLanguage === null && isLoading)) {
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
            handleChoose={() => handleChoose(item.languageId)}
            {...(currentLanguage && {
              chosen: currentLanguage.languageId === item.languageId
            })}
          />
        ))}
    </div>
  );
}

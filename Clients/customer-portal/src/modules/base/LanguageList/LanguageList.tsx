import styles from './LanguageList.module.pcss';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Loader from '../../../components/base/Loader/Loader.tsx';
import LanguageCard from '../../../components/base/LanguageCard/LanguageCard.tsx';
import { useLanguagesStore } from '../../../store/languages/languages.store.ts';

export default function LanguageList() {
  const { isLoading, languages, getActiveLanguage } = useLanguagesStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      languages: state.languages,
      getActiveLanguage: state.getActiveLanguage
    }))
  );

  useEffect(() => {
    if (languages.length === 0) {
      getActiveLanguage();
    }
  }, []);

  return (
    <div className={styles.container}>
      {isLoading && <Loader />}

      {!isLoading &&
        languages.length > 0 &&
        languages.map((item) => (
          <LanguageCard key={item.languageId} title={item.name} description={item.description} />
        ))}
    </div>
  );
}

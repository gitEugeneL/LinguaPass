import cn from 'classnames';

import styles from './LanguageIcon.module.pcss';
import type { LanguageIconProps } from './LanguageIcon.props.ts';

export function LanguageIcon({ isSingle = false, ...props }: LanguageIconProps) {
  const languageCodeMap: { [key: string]: string } = {
    English: 'en',
    Spanish: 'es',
    French: 'fr',
    German: 'de',
    Italian: 'it',
    Japanese: 'ja',
    Chinese: 'zh',
    Portugal: 'pt'
  };

  const languageCode = props.name ? languageCodeMap[props.name] : 'fallback';

  return (
    <div
      title={props.name}
      className={cn(styles.icon, {
        [styles.singleIcon]: isSingle,
        [styles[languageCode]]: props.name
      })}
    >
      <div className={styles.title}>
        {isSingle ? props.name + ' program' : `${languageCode.toUpperCase()}`}
      </div>
    </div>
  );
}

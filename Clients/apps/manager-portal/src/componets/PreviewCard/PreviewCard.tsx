import { LanguageIcon, Status } from '../../UI';

import styles from './PreviewCard.module.pcss';
import type { PreviewCardProps } from './PreviewCard.props.ts';

export function PreviewCard({ count = 0, ...props }: PreviewCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.wrapper}>
        <div className={styles.statusWrapper}>
          <Status isActive={props.isActiveStatus} create={props.isCreate} />
          <span className={styles.preview}>preview</span>
        </div>

        {props.appearance === 'country' && (
          <h3 className={styles.name}>{props.name ? props.name : 'Country name'}</h3>
        )}

        {props.appearance === 'school' && (
          <div className={styles.schoolNameWrapper}>
            <h3 className={styles.name}>{props.name ? props.name : 'School name'}</h3>

            <div className={styles.shortNameWrapper}>
              <span>
                {styles.shortName}
                {props.shortName ? props.shortName : 'Short name'}
              </span>

              <div className={styles.countryWrapper}>
                <span className={styles.country}>{props.country ? props.country : 'Country'}</span>
                <span className={styles.city}>{props.city ? props.city : 'City'}</span>
              </div>
            </div>
          </div>
        )}

        <span className={styles.count}>
          {props.appearance === 'country' && 'Schools: '}
          {props.appearance === 'school' && 'Courses: '}
          {props.isCreate ? '-' : count}
        </span>

        {props.appearance === 'school' && props.languages && (
          <div className={styles.languageWrapper}>
            {props.languages.map((language) => (
              <LanguageIcon key={language} name={language} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

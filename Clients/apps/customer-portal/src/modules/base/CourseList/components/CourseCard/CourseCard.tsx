import { Button } from '@clients/shared';
import cn from 'classnames';

import styles from './CourseCard.module.pcss';
import { type CourseCardProps } from './CourseCard.props.ts';


export function CourseCard({ chosen = undefined, ...props }: CourseCardProps) {
  const handleCLick = () => {
    if (!props.isBlocked) {
      props.handleChoose(props.courseId);
    }
  };

  return (
    <li
      onClick={handleCLick}
      className={cn(styles.card, {
        [styles.chosenCard]: chosen !== undefined && chosen,
        [styles.notChosenCard]: chosen !== undefined && !chosen,
        [styles.activeCard]: props.isLoading
      })}
    >
      <div className={styles.info}>
        <div className={styles.infoWrapper}>
          <div>
            <div className={styles.infoText}>
              Location:<span className={styles.infoContent}>{props.location}</span>
            </div>
            <div className={styles.infoText}>
              Duration:<span className={styles.infoContent}>{props.duration}</span>
            </div>
            <div className={styles.infoText}>
              Accommodation:
              <span className={styles.infoContent}>{props.withAccommodation ? 'yes' : 'no'}</span>
            </div>
          </div>
          <div>
            <div className={styles.infoText}>
              Admission fee:<span className={styles.infoContent}>{props.admissionFee}€</span>
            </div>
            <div className={styles.infoText}>
              Price from:<span className={styles.infoContent}>{props.price}€</span>
            </div>
          </div>
        </div>

        <div className={styles.btn}>
          <Button
            name={chosen === undefined ? 'Apply online' : chosen ? 'Next step' : 'Change course'}
            appearance={chosen === false || chosen === undefined ? 'special' : 'primary'}
            size='large'
          />
        </div>
      </div>
      <div
        className={cn(styles.main, {
          [styles.loading]: props.isLoading
        })}
      >
        <div className={styles.mainWrapper}>
          <h2 className={styles.name}>{props.name}</h2>
          <span className={styles.school}>{props.schoolName}</span>
          <span className={styles.type}>{props.languageName}</span>
        </div>

        <p className={styles.description}>{props.description}</p>

        <p className={styles.activities}>
          <span className={styles.activitiesTitle}>Activities: </span>Economy of Millionaires,
          Global
          {props.activities}
        </p>
      </div>
    </li>
  );
}

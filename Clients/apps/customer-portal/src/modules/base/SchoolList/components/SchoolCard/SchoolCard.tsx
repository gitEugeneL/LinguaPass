import cn from 'classnames';

import styles from './SchoolCard.module.pcss';
import { type SchoolCardProps } from './SchoolCard.props.ts';

export function SchoolCard({ ...props }: SchoolCardProps) {
  const handleClick = () => {
    props.handleChoose(props.schoolId, props.countryId);
  };

  return (
    <div
      className={cn(styles.card, {
        [styles.currentCard]: props.currentSchoolId === props.schoolId && props.updatedStatus
      })}
      onClick={handleClick}
    >
      <span className={styles.city}>{props.city}</span>
      <h3 className={styles.name}>{props.name}</h3>
    </div>
  );
}

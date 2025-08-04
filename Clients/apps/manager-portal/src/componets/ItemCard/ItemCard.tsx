import { Button } from '@clients/shared';
import cn from 'classnames';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Status } from '../../UI';

import styles from './ItemCard.module.pcss';
import type { ItemCardProps } from './ItemCard.props.ts';
import { LanguageIcon } from './UI';

export function ItemCard({
  city = null,
  country = null,
  languages = null,
  ...props
}: ItemCardProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);
  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);

  const handleEdit = () => {
    navigate(`${location.pathname}/add-edit/${props.itemId}`);
  };

  const handleShowList = () => {
    navigate(`${location.pathname}/schools/${props.itemId}`);
  };

  return (
    <div
      className={cn(styles.card, {
        [styles.bigCard]: props.appearance === 'school'
      })}
      tabIndex={0}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.nameWrapper}>
        <div className={styles.statusWrapper}>
          <Status isActive={props.isActiveStatus} />
          {(props.appearance === 'school' || props.appearance === 'course') && city && country && (
            <div className={styles.countryWrapper}>
              <span className={styles.country}>{country}</span>
              <span className={styles.city}>{city}</span>
            </div>
          )}
        </div>
        <h3
          className={cn({
            [styles.name]: props.appearance === 'country',
            [styles.smallName]: props.appearance === 'school' || props.appearance === 'course'
          })}
        >
          {props.name}
        </h3>

        {props.appearance === 'school' || props.appearance === 'course' ? (
          <div className={styles.languages}>
            {languages &&
              languages.map((language) => <LanguageIcon key={language} name={language} />)}
          </div>
        ) : null}
      </div>

      <div className={styles.btnWrapper}>
        <Button
          name={`${props.appearance === 'school' ? 'Courses' : 'Schools'}: ${props.elemCount}`}
          size='small'
          appearance={isActive ? 'primary' : 'specialSecondary'}
          onClick={handleShowList}
        />
        <Button
          name='Edit'
          size='small'
          appearance={isActive ? 'secondary' : 'specialSecondary'}
          onClick={handleEdit}
        />
      </div>
    </div>
  );
}

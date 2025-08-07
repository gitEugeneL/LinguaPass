import { Button } from '@clients/shared';
import cn from 'classnames';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { LanguageIcon, Status } from '../../UI';

import styles from './ItemCard.module.pcss';
import type { ItemCardProps } from './ItemCard.props.ts';

export function ItemCard({
  parentId = null,
  parentName = null,
  city = null,
  country = null,
  languages = null,
  ...props
}: ItemCardProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);
  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);

  const handleEdit = () => {
    if (props.appearance === 'country') {
      navigate(`/programs/countries/add-edit/${props.itemId}`);
    } else if (props.appearance === 'school' && parentId) {
      navigate(`/programs/schools/add-edit/${parentId}/${props.itemId}`);
    } else if (props.appearance === 'course' && parentId) {
      navigate(`/programs/courses/add-edit/${parentId}/${props.itemId}`);
    }
  };

  const handleShowList = () => {
    if (props.appearance === 'country') {
      navigate(`/programs/schools/${props.itemId}`);
    } else if (props.appearance === 'school') {
      navigate(`/programs/courses/${props.itemId}`);
    }
  };

  return (
    <div
      className={cn(styles.card, {
        [styles.bigCard]: props.appearance === 'school' || props.appearance === 'course'
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
          {(props.appearance === 'school' || props.appearance === 'course') && city && country ? (
            <div className={styles.countryWrapper}>
              <span className={styles.country}>{country}</span>
              <span className={styles.city}>{city}</span>
            </div>
          ) : null}
        </div>
        <h3
          className={cn({
            [styles.name]: props.appearance === 'country',
            [styles.smallName]: props.appearance === 'school' || props.appearance === 'course'
          })}
        >
          {props.name}
        </h3>

        {parentName && props.appearance === 'course' && (
          <span className={styles.parentName}>{parentName}</span>
        )}
        {props.appearance === 'school' || props.appearance === 'course' ? (
          <div className={styles.languages}>
            {languages &&
              languages.map((language) => (
                <LanguageIcon
                  isSingle={props.appearance === 'course' && languages.length === 1}
                  key={language}
                  name={language}
                />
              ))}
          </div>
        ) : null}
      </div>

      <div className={styles.btnWrapper}>
        {props.appearance === 'country' || props.appearance === 'school' ? (
          <Button
            name={`${props.appearance === 'school' ? 'Courses' : 'Schools'}: ${props.elemCount}`}
            size='small'
            appearance={isActive ? 'primary' : 'specialSecondary'}
            onClick={handleShowList}
          />
        ) : null}

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

import { Button } from '@clients/shared';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { Status } from '../../UI/Status/Status.tsx';

import styles from './ItemCard.module.pcss';
import type { ItemCardProps } from './ItemCard.props.ts';

export function ItemCard({ ...props }: ItemCardProps) {
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

  return (
    <div
      className={styles.card}
      tabIndex={0}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.nameWrapper}>
        <Status isActive={props.isActiveStatus} />
        <h3 className={styles.name}>{props.name}</h3>
      </div>

      <div className={styles.btnWrapper}>
        <Button
          name={`Schools: ${props.elemCount}`}
          size='small'
          appearance={isActive ? 'primary' : 'specialSecondary'}
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

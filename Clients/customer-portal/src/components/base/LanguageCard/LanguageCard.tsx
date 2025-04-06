import styles from './LanguageCard.module.pcss';
import Button from '../../../UI/Button/Button.tsx';
import UKIcon from './icons/UKIcon.tsx';
import { useState } from 'react';
import { LanguageCardProps } from './LanguageCard.props.ts';
import SpainIcon from './icons/SpainIcon.tsx';
import FranceIcon from './icons/FranceIcon.tsx';
import GermanyIcon from './icons/GermanyIcon.tsx';
import ItalyIcon from './icons/ItalyIcon.tsx';
import JapanIcon from './icons/JapanIcon.tsx';
import ChinaIcon from './icons/ChinaIcon.tsx';
import PortugalIcon from './icons/PortugalIcon.tsx';
import cn from 'classnames';

export default function LanguageCard({ chosen = undefined, ...props }: LanguageCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isActive, setIsActive] = useState<boolean>(false);

  const handleHover = (state: boolean) => {
    setIsHovered(state);
  };

  const handleCLick = () => {
    props.handleClick();
    setIsActive(true);
  };

  return (
    <div
      className={cn(styles.card, {
        [styles.active]: isActive,
        [styles.chosenCard]: (chosen !== undefined && chosen) || isActive,
        [styles.notChosenCard]: chosen !== undefined && !chosen && !isActive
      })}
      onClick={handleCLick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      onFocus={() => handleHover(true)}
      onBlur={() => handleHover(false)}
      tabIndex={0}
    >
      <h2 className={styles.title}>{props.title}</h2>
      <div className={styles.icon}>
        {props.title === 'English' && <UKIcon />}
        {props.title === 'Spanish' && <SpainIcon />}
        {props.title === 'French' && <FranceIcon />}
        {props.title === 'German' && <GermanyIcon />}
        {props.title === 'Italian' && <ItalyIcon />}
        {props.title === 'Japanese' && <JapanIcon />}
        {props.title === 'Chinese' && <ChinaIcon />}
        {props.title === 'Portugal' && <PortugalIcon />}
      </div>
      <p className={styles.description}>
        {props.description.length > 80 ? props.description.slice(0, 80) + '...' : props.description}
      </p>
      {chosen === undefined && (
        <Button
          size='large'
          name="Let's begin"
          appearance={isHovered || isActive ? 'primary' : 'disabled'}
          isLoading={props.isLoading}
        />
      )}
      {chosen !== undefined && (
        <Button
          size='large'
          name={chosen ? 'Next steep' : 'Change language'}
          appearance={chosen || isHovered || isActive ? 'primary' : 'disabled'}
          isLoading={props.isLoading}
        />
      )}
    </div>
  );
}

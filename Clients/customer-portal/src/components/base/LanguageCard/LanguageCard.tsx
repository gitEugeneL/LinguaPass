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

export default function LanguageCard({ ...props }: LanguageCardProps) {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleHover = (state: boolean) => setIsHovered(state);

  return (
    <div
      onClick={props.handleClick}
      className={styles.card}
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
      <Button name="Let's begin" size='large' appearance={isHovered ? 'primary' : 'disabled'} />
    </div>
  );
}

import styles from './NavigationCard.module.pcss';
import HomeIcon from './icons/HomeIcon.tsx';
import { Link } from 'react-router';
import ArrowIcon from '../../../../../assets/icons/ArrowIcon.tsx';

export default function NavigationCard() {
  return (
    <div className={styles.card}>
      <Link to='#' className={styles.home}>
        <HomeIcon />
      </Link>
      <div className={styles.arrow}>
        <ArrowIcon />
      </div>
      <div className={styles.name}>Course</div>
    </div>
  );
}

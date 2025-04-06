import styles from './NavigationCard.module.pcss';
import HomeIcon from './icons/HomeIcon.tsx';
import { Link, useLocation } from 'react-router';
import ArrowIcon from '../../../../../assets/icons/ArrowIcon.tsx';
import { NavigationCardProps } from './NavigationCard.props.ts';

export default function NavigationCard({ routes }: NavigationCardProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const currentName = routes.find((route) => route.to === currentPath)?.name;

  return (
    <div className={styles.card}>
      <Link to='/home' className={styles.home}>
        <HomeIcon />
      </Link>
      <div className={styles.arrow}>
        <ArrowIcon />
      </div>
      <div className={styles.name}>{currentName}</div>
    </div>
  );
}

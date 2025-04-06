import styles from './AccountCard.module.pcss';
import ArrowIcon from '../../../../../assets/icons/ArrowIcon.tsx';
import NavItem from '../../UI/NavItem/NavItem.tsx';
import { AccountCardProps } from './AccountCard.props.ts';
import { useProgressStore } from '../../../../../store/progress/progress.store.ts';

export default function AccountCard({ ...props }: AccountCardProps) {
  const status = useProgressStore((state) => state.myStatus);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.shortName}>eug@lihon.com</div>
        <div className={styles.nameSymbol}>EU</div>
        <div className={styles.arrow}>
          <ArrowIcon />
        </div>
        <div className={styles.fullName}>Firstname Lastname</div>
      </div>

      <ul className={styles.navBlock} onClick={props.toggleDrawer}>
        {props.routes.map((route, index) => (
          <NavItem
            key={index}
            name={route.name}
            to={route.to}
            disabled={status !== null && status.order < route.order}
          />
        ))}

        <div className={styles.navBottom}>
          <NavItem name='My account' to='/' />
          <NavItem name='Logout' />
        </div>
      </ul>
    </div>
  );
}

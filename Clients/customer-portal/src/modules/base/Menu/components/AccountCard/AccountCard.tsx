import styles from './AccountCard.module.pcss';
import ArrowIcon from '../../../../../assets/icons/ArrowIcon.tsx';
import NavItem from '../../UI/NavItem/NavItem.tsx';
import { AccountCardProps } from './AccountCard.props.ts';
import { routesArray } from '../../../../../helpers/routeHelpers.ts';

export default function AccountCard({ ...props }: AccountCardProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.shortName}>{props.email}</div>

        {props.email && !props.name && !props.surname && (
          <div className={styles.nameSymbol}>{props.email.slice(0, 2).toUpperCase()}</div>
        )}
        {props.name && props.surname && (
          <div className={styles.nameSymbol}>
            {props.name.slice(0, 1).toUpperCase()}
            {props.surname.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className={styles.arrow}>
          <ArrowIcon />
        </div>
        {props.name && props.surname && (
          <div className={styles.fullName}>
            {props.name} {props.surname}
          </div>
        )}
      </div>

      <ul className={styles.navBlock} onClick={props.toggleDrawer}>
        {routesArray.map((route, index) => (
          <NavItem
            key={index}
            name={route.name}
            to={route.to}
            disabled={props.statusOrder !== null && props.statusOrder < route.order}
          />
        ))}

        <div className={styles.navBottom}>
          <NavItem name='Logout' />
        </div>
      </ul>
    </div>
  );
}

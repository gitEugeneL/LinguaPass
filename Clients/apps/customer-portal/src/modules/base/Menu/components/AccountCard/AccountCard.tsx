import { ArrowIcon } from '@clients/shared';

import { routesArray } from '../../../../../helpers';
import { NavItem } from '../../UI';

import styles from './AccountCard.module.pcss';
import { type AccountCardProps } from './AccountCard.props.ts';

export function AccountCard({ ...props }: AccountCardProps) {
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

        <div className={styles.navBottom} onClick={props.handleLogout}>
          <NavItem name='Logout' />
        </div>
      </ul>
    </div>
  );
}

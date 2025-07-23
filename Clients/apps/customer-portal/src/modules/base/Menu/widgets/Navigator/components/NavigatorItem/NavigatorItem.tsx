import { ArrowIcon } from '@clients/shared';
import cn from 'classnames';
import { NavLink } from 'react-router';

import styles from './NavigatorItem.module.pcss';
import { type NavigatorItemProps } from './NavigatorItem.props.ts';

export function NavigatorItem({ ...props }: NavigatorItemProps) {
  return (
    <>
      <div className={styles.arrow}>
        <ArrowIcon />
      </div>

      <NavLink
        to={props.to}
        className={({ isActive }) =>
          cn(styles.item, {
            [styles.active]: isActive
          })
        }
      >
        {props.name}
      </NavLink>
    </>
  );
}

import cn from 'classnames';
import { NavLink } from 'react-router';

import styles from './NavigatorItem.module.pcss';
import type { NavigatorItemProps } from './NavigatorItem.props.ts';

export function NavigatorItem({ ...props }: NavigatorItemProps) {
  return (
    <li>
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
    </li>
  );
}

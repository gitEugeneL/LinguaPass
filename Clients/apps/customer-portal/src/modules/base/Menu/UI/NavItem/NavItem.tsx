import cn from 'classnames';
import { NavLink } from 'react-router';

import styles from './NavItem.module.pcss';
import { type NavItemProps } from './NavItem.props.ts';

export function NavItem({ name, to, disabled = false }: NavItemProps) {
  return (
    <li>
      {to && (
        <NavLink
          to={to}
          className={({ isActive }) =>
            cn(styles.item, {
              [styles.disabled]: disabled,
              [styles.active]: isActive
            })
          }
          onClick={(e) => disabled && e.preventDefault()}
        >
          {name}
        </NavLink>
      )}

      {!to && (
        <div
          className={cn(styles.item, {
            [styles.disabled]: disabled
          })}
        >
          {name}
        </div>
      )}
    </li>
  );
}

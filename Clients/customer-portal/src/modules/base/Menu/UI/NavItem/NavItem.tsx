import styles from './NavItem.module.pcss';
import { NavItemProps } from './NavItem.props.ts';
import { NavLink } from 'react-router';
import cn from 'classnames';

export default function NavItem({ name, to, disabled = false }: NavItemProps) {
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

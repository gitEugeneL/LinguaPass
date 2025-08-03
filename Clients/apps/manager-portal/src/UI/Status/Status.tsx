import cn from 'classnames';

import styles from './Stastus.module.pcss';
import type { StatusProps } from './Status.props.ts';

export function Status({ isActive = false, create = false }: StatusProps) {
  return (
    <span
      className={cn(styles.status, {
        [styles.disabled]: !isActive
      })}
    >
      {isActive && 'Active'}
      {!isActive && !create && 'Disabled'}
      {create && 'New'}
    </span>
  );
}

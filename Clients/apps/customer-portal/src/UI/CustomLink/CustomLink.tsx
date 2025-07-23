import { NavLink } from 'react-router';

import styles from './CustomLink.module.pcss';
import { type CustomLinkProps } from './CustomLink.props.ts';

export function CustomLink({ ...props }: CustomLinkProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{props.label}</div>
      <NavLink className={styles.link} to={props.linkUrl}>
        {props.linkName}
      </NavLink>
    </div>
  );
}

import { CustomLinkProps } from './CustomLink.props.ts';
import styles from './CustomLink.module.pcss';
import { NavLink } from 'react-router';

export default function CustomLink({ ...props }: CustomLinkProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>{props.label}</div>
      <NavLink className={styles.link} to={props.linkUrl}>
        {props.linkName}
      </NavLink>
    </div>
  );
}

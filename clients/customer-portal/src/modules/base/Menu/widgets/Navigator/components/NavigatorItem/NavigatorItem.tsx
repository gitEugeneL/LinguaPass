import styles from './NavigatorItem.module.pcss';
import { NavigatorItemProps } from './NavigatorItem.props.ts';
import { NavLink } from 'react-router';
import cn from 'classnames';
import ArrowIcon from '../../../../../../../assets/icons/ArrowIcon.tsx';

export default function NavigatorItem({ ...props }: NavigatorItemProps) {
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

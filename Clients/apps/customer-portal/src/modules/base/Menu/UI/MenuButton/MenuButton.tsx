import { MenuButtonIcon } from './icons/MenuButtonIcon.tsx';
import styles from './MenuButton.module.pcss';
import { type MenuButtonProps } from './MenuButton.props.ts';

export function MenuButton({ toggleDrawer }: MenuButtonProps) {
  return (
    <div className={styles.button} onClick={toggleDrawer}>
      <MenuButtonIcon />
    </div>
  );
}

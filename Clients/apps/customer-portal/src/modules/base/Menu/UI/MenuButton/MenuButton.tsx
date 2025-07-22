import { type MenuButtonProps } from './MenuButton.props.ts';
import styles from './MenuButton.module.pcss';
import { MenuButtonIcon } from './icons/MenuButtonIcon.tsx';

export default function MenuButton({ toggleDrawer }: MenuButtonProps) {
  return (
    <div className={styles.button} onClick={toggleDrawer}>
      <MenuButtonIcon />
    </div>
  );
}

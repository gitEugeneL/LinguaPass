import { LogoItem } from './components';
import styles from './Menu.module.pcss';
import { Navigator } from './widgets';

export function Menu() {
  return (
    <div className={styles.container}>
      <LogoItem />
      <Navigator />
    </div>
  );
}

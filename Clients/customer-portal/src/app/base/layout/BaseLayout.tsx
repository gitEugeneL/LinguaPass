import { Outlet } from 'react-router';
import MainFooter from '../../../components/base/MainFooter/MainFooter.tsx';
import styles from './BaseLayout.module.pcss';
import Menu from '../../../modules/base/Menu/Menu.tsx';

export default function BaseLayout() {
  return (
    <div className={styles.container}>
      <Menu />
      <div className={styles.body}>
        <Outlet />
      </div>
      <div className={styles.footer}>
        <MainFooter />
      </div>
    </div>
  );
}

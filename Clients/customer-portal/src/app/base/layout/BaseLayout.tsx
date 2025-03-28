import { Outlet } from 'react-router';
import MainFooter from '../../../components/base/MainFooter/MainFooter.tsx';
import styles from './BaseLayout.module.pcss';
import Menu from '../../../modules/base/Menu/Menu.tsx';
import Stepper from '../../../modules/base/Stepper/Stepepr.tsx';

export default function BaseLayout() {
  return (
    <div className={styles.container}>
      <Menu />
      <div className={styles.body}>
        <Stepper />
        <Outlet />
      </div>
      <div className={styles.footer}>
        <MainFooter />
      </div>
    </div>
  );
}

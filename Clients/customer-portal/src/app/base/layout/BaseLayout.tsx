import { Outlet } from 'react-router';
import MainFooter from '../../../components/base/MainFooter/MainFooter.tsx';
import styles from './BaseLayout.module.pcss';
import Menu from '../../../modules/base/Menu/Menu.tsx';
import Stepper from '../../../modules/base/Stepper/Stepepr.tsx';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';

export default function BaseLayout() {
  const { statuses, isLoading, myStatus, getAllStatuses, getMyStatus } = useProgressStore(
    useShallow((state) => ({
      statuses: state.statuses,
      isLoading: state.isLoading,
      myStatus: state.myStatus,
      getAllStatuses: state.getAllStatuses,
      getMyStatus: state.getMyStatus
    }))
  );

  useEffect(() => {
    if (myStatus === null) {
      getMyStatus();
    }
  }, []);

  useEffect(() => {
    if (statuses.length === 0) {
      getAllStatuses();
    }
  }, []);

  return (
    <div className={styles.container}>
      <Menu />
      <div className={styles.body}>
        <Stepper isLoading={isLoading} statuses={statuses} />
        <Outlet />
      </div>
      <div className={styles.footer}>
        <MainFooter />
      </div>
    </div>
  );
}

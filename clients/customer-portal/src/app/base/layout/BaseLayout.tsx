import styles from './BaseLayout.module.pcss';
import MainFooter from '../../../components/base/MainFooter/MainFooter.tsx';
import Menu from '../../../modules/base/Menu/Menu.tsx';
import Stepper from '../../../modules/base/Stepper/Stepepr.tsx';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { routesArray } from '../../../helpers/routeHelpers.ts';
import { useAccountStore } from '../../../store/account/account.store.ts';

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

  const { account, getCurrentAccount } = useAccountStore(
    useShallow((state) => ({
      account: state.account,
      getCurrentAccount: state.getCurrentAccount
    }))
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (statuses.length === 0) {
        await getAllStatuses();
      }
      if (myStatus === null) {
        await getMyStatus();
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (myStatus !== null) {
      const lastRoute = routesArray.find((route) => route.order === myStatus.order);
      if (lastRoute) {
        navigate(lastRoute.to);
      }
    }
  }, [myStatus]);

  useEffect(() => {
    const fetchData = async () => {
      if (myStatus !== null && account === null) {
        await getCurrentAccount();
      }
    };
    fetchData();
  }, [myStatus]);

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

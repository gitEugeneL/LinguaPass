import { Stepper } from '@clients/shared';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { MainFooter } from '../../../components/base';
import { routesArray } from '../../../helpers';
import { Menu } from '../../../modules/base';
import { useAccountStore, useProgressStore } from '../../../store';

import styles from './BaseLayout.module.pcss';

export function BaseLayout() {
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

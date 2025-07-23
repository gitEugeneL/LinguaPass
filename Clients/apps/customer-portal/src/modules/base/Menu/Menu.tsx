import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { routes } from '../../../helpers/routeHelpers.ts';
import { useAccountStore, useAuthStore, useProgressStore } from '../../../store';

import { AccountCard } from './components';
import styles from './Menu.module.pcss';
import { MenuButton } from './UI';
import { CustomDrawer, Navigator } from './widgets';

export function Menu() {
  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);

  const status = useProgressStore((state) => state.myStatus);

  const { email, logout } = useAuthStore(
    useShallow((state) => ({
      email: state.email,
      logout: state.logout
    }))
  );

  const { userData, getShortUserInfo } = useAccountStore(
    useShallow((state) => ({
      userData: state.userData,
      getShortUserInfo: state.getShortUserInfo
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!userData && status && status.order > routes.contact.order) {
        await getShortUserInfo();
      }
    };
    fetchData();
  }, [status]);

  const toggleDrawer = () => setIsDrawerOpened(!isDrawerOpened);

  const handleLogout = () => logout();

  return (
    <>
      <div className={styles.menuBox}>
        <Navigator />
        <div className={styles.account}>
          <AccountCard
            statusOrder={status?.order ?? null}
            email={email}
            name={userData?.name ?? null}
            surname={userData?.surname ?? null}
            handleLogout={handleLogout}
          />
        </div>
        <MenuButton toggleDrawer={toggleDrawer} />
      </div>

      <CustomDrawer toggleDrawer={toggleDrawer} isDrawerOpened={isDrawerOpened}>
        <AccountCard
          toggleDrawer={toggleDrawer}
          statusOrder={status?.order ?? null}
          email={email}
          name={userData?.name ?? null}
          surname={userData?.surname ?? null}
          handleLogout={handleLogout}
        />
      </CustomDrawer>
    </>
  );
}

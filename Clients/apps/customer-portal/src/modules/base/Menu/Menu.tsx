import styles from './Menu.module.pcss';
import MenuButton from './UI/MenuButton/MenuButton.tsx';
import CustomDrawer from './widgets/CustomDrawer/CustomDrawer.tsx';
import { useEffect, useState } from 'react';
import AccountCard from './components/AccountCard/AccountCard.tsx';
import Navigator from './widgets/Navigator/Navigator.tsx';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useAccountStore } from '../../../store/account/account.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { routes } from '../../../helpers/routeHelpers.ts';
import { useAuthStore } from '../../../store/auth/auth.store.ts';

export default function Menu() {
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

import styles from './Menu.module.pcss';
import MenuButton from './UI/MenuButton/MenuButton.tsx';
import CustomDrawer from './widgets/CustomDrawer/CustomDrawer.tsx';
import { useState } from 'react';
import AccountCard from './components/AccountCard/AccountCard.tsx';
import Navigator from './widgets/Navigator/Navigator.tsx';

export default function Menu() {
  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);

  const toggleDrawer = () => setIsDrawerOpened(!isDrawerOpened);

  return (
    <>
      <div className={styles.menuBox}>
        <Navigator />
        <div className={styles.account}>
          <AccountCard />
        </div>
        <MenuButton toggleDrawer={toggleDrawer} />
      </div>

      <CustomDrawer toggleDrawer={toggleDrawer} isDrawerOpened={isDrawerOpened}>
        <AccountCard toggleDrawer={toggleDrawer} />
      </CustomDrawer>
    </>
  );
}

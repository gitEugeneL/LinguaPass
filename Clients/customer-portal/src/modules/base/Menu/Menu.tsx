import styles from './Menu.module.pcss';
import NavigationCard from './components/NavigationCard/NavigationCard.tsx';
import MenuButton from './UI/MenuButton/MenuButton.tsx';
import CustomDrawer from './widgets/CustomDrawer/CustomDrawer.tsx';
import { useState } from 'react';
import AccountCard from './components/AccountCard/AccountCard.tsx';
import { MenuProps } from './Menu.props.ts';

export default function Menu({ ...props }: MenuProps) {
  const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);

  const toggleDrawer = () => setIsDrawerOpened(!isDrawerOpened);

  return (
    <>
      <div className={styles.menuBox}>
        <NavigationCard routes={props.routes} />
        <div className={styles.account}>
          <AccountCard routes={props.routes} />
        </div>
        <MenuButton toggleDrawer={toggleDrawer} />
      </div>

      <CustomDrawer toggleDrawer={toggleDrawer} isDrawerOpened={isDrawerOpened}>
        <AccountCard routes={props.routes} toggleDrawer={toggleDrawer} />
      </CustomDrawer>
    </>
  );
}

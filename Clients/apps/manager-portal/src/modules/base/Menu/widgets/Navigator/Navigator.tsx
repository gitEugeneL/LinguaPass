import { useShallow } from 'zustand/react/shallow';

import { useAuthStore } from '../../../../../store';

import { AdminCard, NavigatorWrapper } from './components';
import styles from './Navigator.module.pcss';
import { NavigatorItem } from './UI';

export function Navigator() {
  const { logout, email } = useAuthStore(
    useShallow((state) => ({
      logout: state.logout,
      email: state.email
    }))
  );

  const handleLogout = () => {
    logout();
  };

  return (
    <ul className={styles.container}>
      <div>
        <NavigatorItem name='Home' to='/home' />

        <NavigatorWrapper name='Programs'>
          <NavigatorItem name='Countries' to='/programs/countries' />
          <NavigatorItem name='Schools' to='/programs/schools' />
          <NavigatorItem name='Coursees' to='/programs/courses' />
        </NavigatorWrapper>

        <NavigatorWrapper name='Students'>
          <NavigatorItem name='Current' to='/students/current' />
          <NavigatorItem name='Archived' to='/students/archived' />
        </NavigatorWrapper>
      </div>

      <AdminCard email={email!}>
        <NavigatorItem name='Managers' to='#' />
        <NavigatorItem name='Logout' to='/logout' onClick={handleLogout} />
      </AdminCard>
    </ul>
  );
}

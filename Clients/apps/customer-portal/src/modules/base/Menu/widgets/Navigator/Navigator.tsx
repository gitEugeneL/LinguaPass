import cn from 'classnames';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';

import { type Route, routesArray } from '../../../../../helpers';
import { useProgressStore } from '../../../../../store';

import { NavigatorItem } from './components';
import HomeIcon from './icons/HomeIcon.tsx';
import styles from './Navigator.module.pcss';

export function Navigator() {
  const myStatus = useProgressStore((state) => state.myStatus);

  const [currentRoute, setCurrentRoute] = useState<Route | undefined>(undefined);
  const [routes, setRoutes] = useState<Route[] | undefined>(undefined);

  useEffect(() => {
    if (myStatus) {
      setCurrentRoute(routesArray.find((r) => r.name === myStatus.name));
    }
  }, [myStatus]);

  useEffect(() => {
    if (currentRoute) {
      setRoutes(routesArray.filter((r) => currentRoute && r.order <= currentRoute.order));
    }
  }, [currentRoute]);

  return (
    <div className={styles.card}>
      <NavLink
        to='/home'
        className={({ isActive }) =>
          cn(styles.home, {
            [styles.active]: isActive
          })
        }
      >
        <HomeIcon />
      </NavLink>

      {routes && routes.length !== 0 && (
        <div className={styles.wrapper}>
          {routes.slice(1).map((route) => (
            <NavigatorItem key={route.to} to={route.to} name={route.name} />
          ))}
        </div>
      )}
    </div>
  );
}

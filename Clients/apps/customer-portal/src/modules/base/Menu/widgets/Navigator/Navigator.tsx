import cn from 'classnames';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';

import { type Route, routes, routesArray } from '../../../../../helpers';
import { useProgressStore } from '../../../../../store';

import { NavigatorItem } from './components';
import HomeIcon from './icons/HomeIcon.tsx';
import styles from './Navigator.module.pcss';

export function Navigator() {
  const myStatus = useProgressStore((state) => state.myStatus);

  const [currentRoute, setCurrentRoute] = useState<Route | undefined>(undefined);
  const [resultRoutes, setResultRoutes] = useState<Route[] | undefined>(undefined);

  useEffect(() => {
    if (myStatus) {
      setCurrentRoute(routesArray.find((r) => r.name === myStatus.name));
    }
  }, [myStatus]);

  useEffect(() => {
    if (currentRoute) {
      setResultRoutes(routesArray.filter((r) => currentRoute && r.order <= currentRoute.order));
    }
  }, [currentRoute]);

  return (
    <div className={styles.card}>
      <NavLink
        to={myStatus && myStatus.order <= routes['documents'].order ? '/home' : '/processing'}
        className={({ isActive }) =>
          cn(styles.home, {
            [styles.active]: isActive
          })
        }
      >
        <HomeIcon />
      </NavLink>

      {myStatus &&
        myStatus.order <= routes['documents'].order &&
        resultRoutes &&
        resultRoutes.length !== 0 && (
          <div className={styles.wrapper}>
            {resultRoutes.slice(1).map((route) => (
              <NavigatorItem key={route.to} to={route.to} name={route.name} />
            ))}
          </div>
        )}
    </div>
  );
}

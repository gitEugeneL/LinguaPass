import { ArrowIcon } from '@clients/shared';
import cn from 'classnames';
import { isValidElement, type ReactNode, useState } from 'react';
import { useLocation } from 'react-router';

import styles from './NavigatorWrapper.module.pcss';
import type { NavigatorWrapperProps } from './NavigatorWrapper.props.ts';

export function NavigatorWrapper({ name, children }: NavigatorWrapperProps) {
  const [isChildrenOpened, setIsChildrenOpened] = useState(false);
  const location = useLocation();

  const handleClick = () => {
    setIsChildrenOpened(!isChildrenOpened);
  };

  const isChildActive = (child: ReactNode): boolean => {
    if (!isValidElement(child)) return false;
    const to = (child.props as { to?: string }).to;
    return location.pathname.startsWith(to!);
  };

  const hasActiveChild = Array.isArray(children)
    ? children.some(isChildActive)
    : isChildActive(children);

  return (
    <div className={styles.wrapper}>
      <div
        className={cn(styles.nameWrapper, {
          [styles.wrapperOpened]: isChildrenOpened,
          [styles.activeParent]: hasActiveChild
        })}
        onClick={handleClick}
      >
        <div className={styles.name}>{name}</div>
        <div className={styles.arrow}>
          <ArrowIcon />
        </div>
      </div>

      <div
        className={cn(styles.children, {
          [styles.childrenOpened]: isChildrenOpened
        })}
      >
        {children}
      </div>
    </div>
  );
}

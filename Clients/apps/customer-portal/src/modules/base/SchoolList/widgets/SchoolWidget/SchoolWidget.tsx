import { ArrowIcon } from '@clients/shared';
import cn from 'classnames';
import * as React from 'react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAccountStore, useSchoolsStore } from '../../../../../store';
import { SchoolCard } from '../../components';

import styles from './SchoolWidget.module.pcss';
import { type SchoolWidgetProps } from './SchoolWidget.props.ts';

export function SchoolWidget({ ...props }: SchoolWidgetProps) {
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const account = useAccountStore((state) => state.account);

  const { isLoading, getSchools, schools, currentCountryId } = useSchoolsStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      schools: state.schools,
      currentCountryId: state.currentCountryId,
      getSchools: state.getSchools
    }))
  );

  const handleClick = async (countryId: string) => {
    props.onClick(countryId);
    const languageId = account?.languageId;
    if ((!props.isOpened || isFirstLoad) && languageId) {
      await getSchools(languageId, countryId);
      setIsFirstLoad(false);
    }
  };

  const handleInnerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  return (
    <li
      className={cn(styles.container, {
        [styles.currentContainer]: currentCountryId === props.countryId && props.updateStatus,
        [styles.unCurrentContainer]:
          currentCountryId !== props.countryId && props.updateStatus && !props.isOpened,
        [styles.openedContainer]: props.isOpened && !isLoading,
        [styles.loadingContainer]: props.isOpened && isLoading,
        [styles.blockedContainer]: !props.isOpened && isLoading
      })}
      onClick={() => handleClick(props.countryId)}
    >
      <div className={styles.wrapper}>
        <div className={styles.textWrapper}>
          <span className={styles.title}>Study in</span>
          <h3 className={styles.country}>{props.name}</h3>
        </div>

        <div className={styles.arrowWrapper}>
          <div className={styles.schoolCount}>
            Schools: <span className={styles.count}>{props.schoolsCount}</span>
          </div>
          <div
            className={cn(styles.arrow, {
              [styles.openedArrow]: props.isOpened && !isLoading
            })}
          >
            <ArrowIcon width={25} height={25} />
          </div>
        </div>
      </div>
      <hr
        className={cn(styles.line, {
          [styles.openedLine]: props.isOpened
        })}
      />

      <div
        onClick={handleInnerClick}
        className={cn(styles.content, {
          [styles.openedContent]: props.isOpened && !isLoading && schools.length !== 0
        })}
      >
        {schools.length !== 0 &&
          props.isOpened &&
          !isLoading &&
          account &&
          schools.map((school) => (
            <SchoolCard
              key={school.schoolId}
              schoolId={school.schoolId}
              currentSchoolId={account.schoolId}
              updatedStatus={props.updateStatus}
              city={school.city}
              name={school.name}
              countryId={school.countryId}
              handleChoose={props.handleChoose}
            />
          ))}
      </div>
    </li>
  );
}

import styles from './SchoolWidget.module.pcss';
import ArrowIcon from '../../../../../assets/icons/ArrowIcon.tsx';
import { SchoolWidgetProps } from './SchoolWidget.props.ts';
import cn from 'classnames';
import { useShallow } from 'zustand/react/shallow';
import * as React from 'react';
import SchoolCard from '../../components/SchoolCard/SchoolCard.tsx';
import { useSchoolsStore } from '../../../../../store/school/school.store.ts';

export default function SchoolWidget({ ...props }: SchoolWidgetProps) {
  const [isFirstLoad, setIsFirstLoad] = React.useState<boolean>(true);

  const { isLoading, getSchools, schools, currentCountryId, currentSchoolId } = useSchoolsStore(
    useShallow((state) => ({
      isLoading: state.isLoading,
      schools: state.schools,
      currentCountryId: state.currentCountryId,
      currentSchoolId: state.currentSchoolId,
      getSchools: state.getSchools
    }))
  );

  const handleClick = async (countryId: string) => {
    props.onClick(countryId);
    if ((!props.isOpened && currentCountryId !== countryId) || isFirstLoad) {
      await getSchools(countryId);
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
          schools.map((school) => (
            <SchoolCard
              key={school.schoolId}
              schoolId={school.schoolId}
              currentSchoolId={currentSchoolId}
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

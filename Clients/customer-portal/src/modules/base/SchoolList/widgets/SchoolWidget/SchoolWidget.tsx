import styles from './SchoolWidget.module.pcss';
import ArrowIcon from '../../../../../assets/icons/ArrowIcon.tsx';
import { SchoolWidgetProps } from './SchoolWidget.props.ts';
import cn from 'classnames';

export default function SchoolWidget({ ...props }: SchoolWidgetProps) {
  return (
    <li
      className={cn(styles.container, {
        [styles.disabled]: props.schoolsCount === 0
      })}
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
          <div className={styles.arrow}>
            <ArrowIcon width={25} height={25} />
          </div>
        </div>
      </div>

      <hr className={styles.line} />
    </li>
  );
}

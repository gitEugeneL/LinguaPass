import cn from 'classnames';

import styles from './StepperItem.module.pcss';
import { type StepperItemProps } from './StepperItem.props.ts';

export function StepperItem({ ...props }: StepperItemProps) {
  return (
    <div className={styles.container}>
      {props.status === 'active' && (
        <h3
          className={cn(styles.name, {
            [styles.nameStart]: props.isFirst,
            [styles.nameEnd]: props.isLast
          })}
        >
          {props.name === 'Language' && 'Choose a language'}
          {props.name === 'School' && 'Choose a school'}
          {props.name === 'Course' && 'Choose a course'}
          {props.name === 'Contact' && 'Add contact details'}
          {props.name === 'Personal' && 'Add personal details'}
          {props.name === 'Documents' && 'Add documents'}
          {props.name === 'Processing' && 'Application verification'}
          {props.name === 'Complete' && 'Application reviewed'}
        </h3>
      )}

      <div className={styles.item}>
        <div
          className={cn(styles.progress, {
            [styles.progress100]: props.status === 'complete',
            [styles.progress50]: props.status === 'active'
          })}
        />
      </div>
    </div>
  );
}

import styles from './StepperItem.module.pcss';
import { StepperItemProps } from './StepperItem.props.ts';
import cn from 'classnames';

export default function StepperItem({ ...props }: StepperItemProps) {
  return (
    <div className={styles.container}>
      {props.status === 'active' && (
        <h3
          className={cn(styles.name, {
            [styles.nameStart]: props.isFirst,
            [styles.nameEnd]: props.isLast
          })}
        >
          {props.name}
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

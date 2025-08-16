import cn from 'classnames';

import { Loader } from '../index.ts';

import styles from './Stepper.module.pcss';
import { type StepperProps } from './Stepper.props.ts';
import { StepperItem } from './UI/idnex.ts';

export function Stepper({ size = 'normal', ...props }: StepperProps) {
  return (
    <div
      className={cn(styles.container, {
        [styles.smallContainer]: size === 'small'
      })}
    >
      {props.isLoading && <Loader />}

      {!props.isLoading &&
        props.statuses.map((item, index) => (
          <StepperItem
            status={item.status}
            name={item.name}
            isFirst={index === 0}
            isLast={index === props.statuses.length - 1}
            key={index}
          />
        ))}
    </div>
  );
}

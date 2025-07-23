import { Loader } from '../../../components/base';

import { StepperItem } from './components';
import styles from './Stepper.module.pcss';
import { type StepperProps } from './Stepper.props.ts';

export function Stepper({ ...props }: StepperProps) {
  return (
    <div className={styles.container}>
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

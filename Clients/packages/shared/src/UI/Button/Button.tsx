import cn from 'classnames';

import { LoaderIndicator } from '../../assets/elements/LoaderIndicator';

import styles from './Button.module.pcss';
import type { ButtonProps } from './Button.props';

export function Button({
  name,
  appearance = 'primary',
  size = 'normal',
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <>
      <button
        className={cn(styles.btn, {
          [styles.small]: size === 'small',
          [styles.large]: size === 'large',
          [styles.primary]: appearance === 'primary',
          [styles.secondary]: appearance === 'secondary',
          [styles.special]: appearance === 'special',
          [styles.disabled]: appearance === 'disabled',
          [styles.danger]: appearance === 'danger',
          [styles.secondaryDanger]: appearance === 'secondaryDanger'
        })}
        {...props}
      >
        {isLoading && <LoaderIndicator />}
        {!isLoading && name}
      </button>
    </>
  );
}

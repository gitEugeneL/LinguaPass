import { ButtonProps } from './Button.props.tsx';
import styles from './Button.module.pcss';
import cn from 'classnames';
import LoaderIndicator from '../../assets/elements/LoaderIndicator.tsx';

export default function Button({
  name,
  appearance = 'primary',
  size = 'normal',
  isLoading = false,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(styles.btn, {
        [styles.large]: size === 'large',
        [styles.primary]: appearance === 'primary',
        [styles.secondary]: appearance === 'secondary',
        [styles.disabled]: appearance === 'disabled',
        [styles.danger]: appearance === 'danger'
      })}
      {...props}
    >
      {isLoading && <LoaderIndicator />}
      {!isLoading && name}
    </button>
  );
}

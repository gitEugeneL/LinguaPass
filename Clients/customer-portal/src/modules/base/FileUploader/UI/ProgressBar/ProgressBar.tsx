import styles from './ProgressBar.module.pcss';
import { ProgressBarProps } from './ProgressBar.props.ts';

export default function ProgressBar({ ...props }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(props.progress, 0), 100);

  return (
    <div className={styles.bar}>
      <div className={styles.fill} style={{ width: `${clampedProgress}%` }}></div>
    </div>
  );
}

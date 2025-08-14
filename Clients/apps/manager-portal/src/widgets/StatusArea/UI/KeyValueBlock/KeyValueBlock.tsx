import styles from './KeyValueBlock.module.pcss';
import type { KeyValueBlockProps } from './KeyValueBlock.props.ts';

export function KeyValueBlock({ name, value = undefined }: KeyValueBlockProps) {
  return (
    <div className={styles.container}>
      <div className={styles.name}>
        {name}: {value && <span className={styles.value}>{value}</span>}
      </div>
    </div>
  );
}

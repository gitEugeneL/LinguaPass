import styles from './File.module.pcss';
import type { FileProps } from './File.props.ts';
import { FileIcon } from './Icons/FileIcon.tsx';

export function File({ ...props }: FileProps) {
  return (
    <div className={styles.container} onClick={() => props.handleClick(props.name)}>
      <FileIcon />
      <h3 className={styles.name}>{props.name}</h3>
    </div>
  );
}

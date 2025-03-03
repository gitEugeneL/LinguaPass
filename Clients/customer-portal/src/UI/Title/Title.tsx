import { TitleProps } from './Title.props.ts';
import styles from './Title.module.pcss';

export default function Title({ title, description = undefined }: TitleProps) {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}

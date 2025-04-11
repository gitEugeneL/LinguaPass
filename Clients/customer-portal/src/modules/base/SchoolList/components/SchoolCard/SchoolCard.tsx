import styles from './SchoolCard.module.pcss';
import { SchoolCardProps } from './SchoolCard.props.ts';

export default function SchoolCard({ ...props }: SchoolCardProps) {
  return (
    <div className={styles.card}>
      <span className={styles.city}>{props.city}</span>
      <h3 className={styles.name}>{props.name}</h3>
    </div>
  );
}

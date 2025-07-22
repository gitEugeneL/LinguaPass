import LoaderIndicator from '../../../assets/elements/LoaderIndicator.tsx';
import styles from './Loader.module.pcss';

export default function Loader({ color = 'primary' }: { color?: 'primary' | 'secondary' }) {
  return (
    <div className={styles.loader}>
      <LoaderIndicator width={100} height={100} color={color} />
    </div>
  );
}

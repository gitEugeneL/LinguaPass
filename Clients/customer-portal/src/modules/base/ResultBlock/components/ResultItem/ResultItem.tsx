import styles from './ResultItem.module.pcss';
import { ResultItemProps } from './ResultItem.props.ts';
import LoaderIndicator from '../../../../../assets/elements/LoaderIndicator.tsx';

export default function ResultItem({ ...props }: ResultItemProps) {
  return (
    <li className={styles.container}>
      <span className={styles.title}>{props.title}</span>
      {!props.isLoading && (
        <div className={styles.body}>
          {props.body.length > 25 ? props.body.slice(0, 25) + '...' : props.body}
        </div>
      )}

      {props.isLoading && (
        <div className={styles.body}>
          <LoaderIndicator width={15} height={15} color='secondary' />
        </div>
      )}
    </li>
  );
}

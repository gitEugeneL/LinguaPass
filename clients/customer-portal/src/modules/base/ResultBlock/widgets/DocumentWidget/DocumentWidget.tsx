import styles from './DocumentWidget.module.pcss';
import { DocumentWidgetProps } from './DocumentWidget.props.ts';
import SuccessIcon from './icons/SuccessIcon.tsx';

export default function DocumentWidget({ ...props }: DocumentWidgetProps) {
  return (
    <div className={styles.container}>
      {props.fileNames.length > 0 && (
        <div className={styles.wrapper}>
          {props.fileNames.map((item, index) => (
            <div className={styles.item} key={index}>
              <SuccessIcon />
              <span className={styles.name}>{item}</span>
            </div>
          ))}
        </div>
      )}
      {props.fileNames.length === 0 && (
        <span className={styles.error}>No documents have been added yet :(</span>
      )}
    </div>
  );
}

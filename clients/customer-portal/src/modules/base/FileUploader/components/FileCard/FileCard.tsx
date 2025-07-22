import styles from './FileCard.module.pcss';
import Button from '../../../../../UI/Button/Button.tsx';
import { CloseIcon } from '../../../../../assets/icons/CloseIcon.tsx';
import { FileCardProps } from './FileCard.props.ts';
import cn from 'classnames';
import ProgressBar from '../../UI/ProgressBar/ProgressBar.tsx';
import { useDocumentsStore } from '../../../../../store/documet/document.store.ts';

export default function FileCard({ ...props }: FileCardProps) {
  const isLoading = useDocumentsStore((state) => state.isLoading);

  const fileSize = `${(props.size / (1024 * 1024)).toFixed(2)} MB`;

  const handleCloseBtn = () => {
    if (props.isLoading && props.progress !== 100) {
      props.cancelUpload();
    } else {
      props.removeFile();
    }
  };

  const handleUploadBtn = () => {
    if (!isLoading) {
      props.uploadFile();
    }
  };

  return (
    <li
      className={cn(styles.card, {
        [styles.activeCard]: props.isLoading,
        [styles.disabledCard]:
          props.uploadingFileIndex !== null && props.uploadingFileIndex !== props.index
      })}
    >
      <div className={styles.titleBlock}>
        <span className={styles.name}>{props.name}</span>
        <div className={styles.progressBlock}>
          {props.isLoading && <span className={styles.progress}>{props.progress}%</span>}
          {props.isLoading && <span>Uploading...</span>}
          {props.isLoading && <span>·</span>}
          <span>{fileSize}</span>
        </div>
      </div>
      <div
        className={cn(styles.btnBlock, {
          [styles.activeBtnBlock]: props.isLoading
        })}
      >
        {!props.isLoading && (
          <Button
            name='Upload'
            size='small'
            appearance={
              props.uploadingFileIndex !== null && props.uploadingFileIndex !== props.index
                ? 'disabled'
                : 'primary'
            }
            onClick={handleUploadBtn}
            disabled={isLoading}
          />
        )}
        {props.isLoading && <ProgressBar progress={props.progress} />}

        <div className={styles.exit} onClick={handleCloseBtn}>
          <CloseIcon />
        </div>
      </div>
    </li>
  );
}

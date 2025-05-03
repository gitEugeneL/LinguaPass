import styles from './FileCard.module.pcss';
import Button from '../../../../../UI/Button/Button.tsx';
import { CloseIcon } from '../../../../../assets/icons/CloseIcon.tsx';
import { FileCardProps } from './FileCard.props.ts';
import cn from 'classnames';
import ProgressBar from '../../UI/ProgressBar/ProgressBar.tsx';

export default function FileCard({ ...props }: FileCardProps) {
  const fileSize = `${(props.size / (1024 * 1024)).toFixed(2)} MB`;

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
          {props.isLoading && <span>{props.progress}%</span>}
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
            name='Click to upload'
            size='small'
            appearance={
              props.uploadingFileIndex !== null && props.uploadingFileIndex !== props.index
                ? 'disabled'
                : 'primary'
            }
            onClick={props.uploadFile}
            disabled={props.isLoading}
          />
        )}
        {props.isLoading && <ProgressBar progress={props.progress} />}

        <div
          className={styles.exit}
          onClick={props.isLoading ? props.cancelUpload : props.removeFile}
        >
          <CloseIcon />
        </div>
      </div>
    </li>
  );
}

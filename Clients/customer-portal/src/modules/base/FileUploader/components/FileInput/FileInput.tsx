import styles from './FileInput.module.pcss';
import { FileInputProps } from './FileInput.props';
import FileIcon from './icons/FileIcon.tsx';
import cn from 'classnames';

export default function FileInput({ ...props }: FileInputProps) {
  return (
    <div className={styles.container}>
      <input
        className={styles.input}
        type='file'
        accept='application/pdf'
        onChange={props.handleFileChange}
        disabled={props.isLoading}
        id='file-upload'
      />
      <label
        htmlFor='file-upload'
        className={cn(styles.customButton, {
          [styles.disabled]: props.isLoading,
          [styles.error]: props.error
        })}
      >
        <FileIcon />
        {!props.isLoading && props.error && <span>{props.error}</span>}
        {props.isLoading && <span>Uploading...</span>}
        {!props.isLoading && !props.error && <span>Click here to choose files</span>}

        <div className={styles.fileDetails}>
          <span className={styles.fileType}>PDF</span>
          <span className={styles.fileSize}>{'> 2 MB'}</span>
          <span className={styles.fileSize}>5 items</span>
        </div>
      </label>

      <div className={styles.infoBLock}>
        <h2 className={styles.infoTitle}>Documents information</h2>
        <p className={styles.infoDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tristique ligula urna, id
          accumsan ante condimentum nec.
        </p>
      </div>
    </div>
  );
}

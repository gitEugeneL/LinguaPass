import { Button } from '@clients/shared';
import cn from 'classnames';

import styles from './UploadedFile.module.pcss';
import { type UploadedFileProps } from './UploadedFile.props.ts';

export function UploadedFile({ ...props }: UploadedFileProps) {
  const handleDeleteClick = () => {
    props.deleteFile(props.name);
  };

  return (
    <div
      className={cn(styles.container, {
        [styles.disabled]: props.isLoading
      })}
    >
      <h3 className={styles.name}>{`${props.index + 1}. ${props.name}`}</h3>
      <div className={styles.btnBlock} onClick={handleDeleteClick}>
        <Button
          name='Delete'
          appearance={props.isLoading ? 'disabled' : 'secondaryDanger'}
          size='small'
        />
      </div>
    </div>
  );
}

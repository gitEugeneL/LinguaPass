import styles from './ConfirmBlock.module.pcss';
import Button from '../../../UI/Button/Button.tsx';
import { useDocumentsStore } from '../../../store/documet/document.store.ts';
import { useState } from 'react';
import DangerCard from '../../../components/base/DangerCard/DangerCard.tsx';

export default function ConfirmBlock() {
  const [isModalShow, setIsModalShow] = useState<boolean>(false);

  const uploadedFiles = useDocumentsStore((state) => state.uploadedFileNames);

  return (
    <div className={styles.container}>
      <div className={styles.btnBlock}>
        <Button
          onClick={() => setIsModalShow(true)}
          name='Submit now -->'
          appearance={uploadedFiles.length === 0 ? 'disabled' : 'danger'}
          size='large'
        />
      </div>
      {isModalShow && (
        <DangerCard
          title='Send application?'
          description='Please carefully review your form before submitting the application. This action cannot be undone.'
          btn1Text='Send form'
          btn2Text='Close'
          // todo send action
          // todo send action
          // todo send action
          // todo send action
          btn1Action={() => {
            console.log('!!!!send action');
          }}
          btn2Action={() => setIsModalShow(false)}
        />
      )}
    </div>
  );
}

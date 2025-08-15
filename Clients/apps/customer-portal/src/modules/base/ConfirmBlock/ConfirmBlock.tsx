import { Button, DangerCard } from '@clients/shared';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { useAccountStore, useDocumentsStore, useProgressStore } from '../../../store';

import styles from './ConfirmBlock.module.pcss';

export function ConfirmBlock() {
  const [isModalShow, setIsModalShow] = useState<boolean>(false);

  const navigate = useNavigate();

  const { sendApplication, isLoading } = useAccountStore(
    useShallow((state) => ({
      sendApplication: state.sendApplication,
      isLoading: state.isLoading
    }))
  );

  const getMyStatus = useProgressStore((state) => state.getMyStatus);
  const uploadedFiles = useDocumentsStore((state) => state.uploadedFileNames);

  const handleSubmit = async () => {
    if (!isLoading) {
      try {
        await sendApplication();
        await getMyStatus();
        navigate('/processing');
      } catch (error) {
        console.error('Error sending application:');
      }
    }
  };

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
          btn1Action={handleSubmit}
          btn2Action={() => setIsModalShow(false)}
          btn1IsLoading={isLoading}
        />
      )}
    </div>
  );
}

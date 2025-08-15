import { Button } from '@clients/shared';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useAccountStore, useProgressStore } from '../../../store';

import { ErrorProcessingIcon } from './icons/ErrorProcessingIcon.tsx';
import { ProcessingIcon } from './icons/ProcessingIcon.tsx';
import styles from './ProcessingBlock.module.pcss';

export function ProcessingBlock() {
  const { myStatus, getMyStatus } = useProgressStore(
    useShallow((state) => ({
      getMyStatus: state.getMyStatus,
      myStatus: state.myStatus
    }))
  );
  const { account, getCurrentAccount } = useAccountStore(
    useShallow((state) => ({
      getCurrentAccount: state.getCurrentAccount,
      account: state.account
    }))
  );

  useEffect(() => {
    if (myStatus?.order === 8) {
      getCurrentAccount();
    }
  }, [getCurrentAccount, myStatus?.order]);

  useEffect(() => {
    const interval = setInterval(async () => {
      await getMyStatus();
    }, 20000);
    return () => clearInterval(interval);
  }, [getMyStatus]);

  const handleUpdateApplication = () => {
    // todo create logic
    // todo create logic
    // todo create logic
    // todo create logic
    // todo create logic
    // todo create logic
  };

  return (
    <div className={styles.container}>
      {myStatus && myStatus.order === 7 && (
        <>
          <div className={styles.icon}>
            <ProcessingIcon />
          </div>
          <div className={styles.wrapper}>
            <h2 className={styles.title}>
              Your application has been successfully submitted! Document verification is in
              progress...
            </h2>
            <p className={styles.description}>
              There are many variations of passages of Lorem Ipsum available but the majority have
              suffered alteration in some form. There are many variations of passages of Lorem Ipsum
              available.
            </p>
          </div>
        </>
      )}

      {myStatus &&
        myStatus.order === 8 &&
        account &&
        !account.isApplicationComplete &&
        account.applicationNote && (
          <>
            <div className={styles.icon}>
              <ErrorProcessingIcon />
            </div>
            <div className={styles.wrapper}>
              <h2 className={styles.errorTitle}>Your application needs to be correct!</h2>
              <p className={styles.description}>
                There are many variations of passages of Lorem Ipsum available but the majority have
                suffered alteration in some form. There are many variations of passages of Lorem
                Ipsum available.
              </p>
            </div>
            <div className={styles.errorBlock}>
              <h3 className={styles.errorSubTitle}>Comment from administrator:</h3>
              <p className={styles.description}>{account.applicationNote}</p>
              <div className={styles.btn}>
                <Button
                  name='Update application'
                  appearance='primary'
                  onClick={handleUpdateApplication}
                />
              </div>
            </div>
          </>
        )}

      {myStatus && myStatus.order === 8 && account && account.isApplicationComplete && (
        <>
          <div className={styles.icon}>
            <ProcessingIcon />
          </div>
          <div className={styles.wrapper}>
            <h2 className={styles.title}>
              Congratulations! You have successfully submitted your documents. Your application has
              been approved!
            </h2>
            <p className={styles.description}>
              There are many variations of passages of Lorem Ipsum available but the majority have
              suffered alteration in some form. There are many variations of passages of Lorem Ipsum
              available.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

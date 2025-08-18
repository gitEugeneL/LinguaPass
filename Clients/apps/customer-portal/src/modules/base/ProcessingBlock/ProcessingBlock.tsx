import { Button } from '@clients/shared';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { routes } from '../../../helpers';
import {
  useAccountStore,
  useCoursesStore,
  useLanguagesStore,
  useProgressStore,
  useSchoolsStore
} from '../../../store';

import { ErrorProcessingIcon } from './icons/ErrorProcessingIcon.tsx';
import { ProcessingIcon } from './icons/ProcessingIcon.tsx';
import styles from './ProcessingBlock.module.pcss';

export function ProcessingBlock() {
  const navigate = useNavigate();

  const { changeStep, myStatus, getMyStatus } = useProgressStore(
    useShallow((state) => ({
      getMyStatus: state.getMyStatus,
      changeStep: state.changeStep,
      myStatus: state.myStatus
    }))
  );

  const { account, getCurrentAccount, resetApplication } = useAccountStore(
    useShallow((state) => ({
      resetApplication: state.resetApplication,
      getCurrentAccount: state.getCurrentAccount,
      account: state.account
    }))
  );

  const resetSchool = useSchoolsStore((state) => state.restState);
  const resetCourse = useCoursesStore((state) => state.resetCurrentCourse);
  const resetLanguage = useLanguagesStore((state) => state.resetState);

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

  const handleUpdateApplication = async () => {
    try {
      await resetApplication();
      changeStep(routes.language.order);
      resetSchool();
      resetCourse();
      resetLanguage();
      navigate(routes.language.to);
      window.location.reload();
    } catch (error) {
      console.error('Error resetting application:', error);
    }
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

import { Button, formatElapsedTime } from '@clients/shared';
import { useEffect, useState } from 'react';

import { useProgressStore, useStudentStore } from '../../../../../store';

import styles from './InteractionCard.module.pcss';

export function InteractionCard() {
  const [statusName, setStatusName] = useState<string | undefined>(undefined);
  const [statusOrder, setStatusOrder] = useState<number | undefined>(undefined);
  const [elapsedTime, setElapsedTime] = useState<string>('');

  const studentStatuses = useProgressStore((state) => state.studentStatuses);
  const studentDetail = useStudentStore((state) => state.studentDetail);

  useEffect(() => {
    if (studentStatuses.length !== 0) {
      const status = studentStatuses.find((status) => status.status === 'active');
      setStatusName(status?.name);
      setStatusOrder(status?.order);
    }
  }, [studentStatuses]);

  useEffect(() => {
    if (studentDetail?.updatedAt) {
      setElapsedTime(formatElapsedTime(new Date(studentDetail?.updatedAt)));
    }
  }, [studentDetail?.updatedAt]);

  return (
    <div className={styles.card}>
      <div className={styles.infoWrapper}>
        <div className={styles.steps}>
          <span className={styles.subName}>Step {statusOrder}</span>
          <span className={styles.name}>{statusName}</span>
        </div>

        <div className={styles.time}>
          <span className={styles.subName}>Elapsed time</span>
          <span className={styles.name}>{elapsedTime}</span>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <span className={styles.subTitle}>Wait or delete an account</span>
        <h3 className={styles.title}>The user has not submitted the application form yet :(</h3>
        <Button name='Archive account' appearance='danger' />
      </div>
    </div>
  );
}

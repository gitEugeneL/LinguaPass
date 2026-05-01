import { Button, CustomTextarea, formatElapsedTime } from '@clients/shared';
import { yupResolver } from '@hookform/resolvers/yup';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/react/shallow';

import { useProgressStore, useStudentStore } from '../../../../../store';

import {
  type IntegrationCardSchema,
  IntegrationCardValidationSchema
} from './IntegrationCardSchema.ts';
import styles from './InteractionCard.module.pcss';
import type { InteractionCardProps } from './InteractionCard.props.ts';

export function InteractionCard({ ...props }: InteractionCardProps) {
  const [statusName, setStatusName] = useState<string | undefined>(undefined);
  const [statusOrder, setStatusOrder] = useState<number | undefined>(undefined);
  const [elapsedTime, setElapsedTime] = useState<string>('');
  const [isProblemFromActive, setIsProblemFormActive] = useState<boolean>(false);

  const { studentStatuses, getStudentStatus } = useProgressStore(
    useShallow((state) => ({
      studentStatuses: state.studentStatuses,
      getStudentStatus: state.getStudentStatus
    }))
  );

  const { studentDetail, finalizeApplication, getStudentDetail } = useStudentStore(
    useShallow((state) => ({
      studentDetail: state.studentDetail,
      getStudentDetail: state.getStudentDetail,
      finalizeApplication: state.finalizeApplication
    }))
  );

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

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<IntegrationCardSchema>({
    resolver: yupResolver(IntegrationCardValidationSchema),
    mode: 'all',
    defaultValues: {
      message: ''
    }
  });

  const handleProblemsBtn = () => {
    setIsProblemFormActive(true);
  };

  const handleEverythingFineBtn = async () => {
    if (studentDetail && studentDetail.userId) {
      try {
        await finalizeApplication(studentDetail.userId, true);
        await getStudentStatus(studentDetail.userId);
        await getStudentDetail(studentDetail.accountId);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formSubmit = async (schema: IntegrationCardSchema) => {
    if (studentDetail && studentDetail.userId) {
      try {
        await finalizeApplication(studentDetail.userId, false, schema.message);
        await getStudentStatus(studentDetail.userId);
        await getStudentDetail(studentDetail.accountId);
      } catch (error) {
        console.log(error);
      }
    }
  };

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
        {statusOrder && statusOrder <= 6 && (
          <>
            <span className={styles.subTitle}>Wait or delete an account</span>
            <h3 className={styles.title}>
              <b>{studentDetail?.contact?.name ?? 'The user'}</b> has not submitted the application
              form yet :(
            </h3>
            {studentDetail?.isActive && (
              <Button name='Archive account' appearance='danger' onClick={props.changeActive} />
            )}
            {!studentDetail?.isActive && (
              <Button name='Activate account' appearance='primary' onClick={props.changeActive} />
            )}
          </>
        )}
        {statusOrder && statusOrder === 7 && (
          <>
            <span className={styles.subTitle}>You have to check the application form</span>
            <h3 className={styles.title}>
              <b>{studentDetail?.contact?.name ?? 'The user'}</b> has already submitted the
              application form!
            </h3>
            <div className={styles.btnWrapper}>
              <Button
                name='Everything is fine!'
                appearance='primary'
                onClick={handleEverythingFineBtn}
              />
              <Button name='Some problems :(' appearance='danger' onClick={handleProblemsBtn} />
            </div>
            <div
              className={cn(styles.problemsWrapper, {
                [styles.activeWrapper]: isProblemFromActive
              })}
            >
              <span className={styles.subTitle}>
                Now it is necessary to write to the user what the problem is with
              </span>

              <form onSubmit={handleSubmit(formSubmit)}>
                <div className={styles.text}>
                  <CustomTextarea name='message' control={control} errors={errors} maxSize={800} />
                </div>
                <div className={styles.btnWrapper}>
                  <Button name='Send the message' />
                </div>
              </form>
            </div>
          </>
        )}

        {statusOrder &&
          statusOrder === 8 &&
          studentDetail &&
          !studentDetail.isApplicationComplete && (
            <>
              <span className={styles.subTitle}>Wait or archive an account</span>
              <h3 className={styles.title}>
                <b>{studentDetail?.contact?.name ?? 'The user'}</b> has received error messages
              </h3>
              <Button name='Archive account' appearance='danger' />
            </>
          )}

        {statusOrder &&
          statusOrder === 8 &&
          studentDetail &&
          studentDetail.isApplicationComplete && (
            <>
              <span className={styles.subTitle}>It's done!</span>
              <h3 className={styles.title}>
                <b>{studentDetail?.contact?.name ?? 'The user'}</b> has successfully completed the
                submission process!
              </h3>
            </>
          )}
      </div>
    </div>
  );
}

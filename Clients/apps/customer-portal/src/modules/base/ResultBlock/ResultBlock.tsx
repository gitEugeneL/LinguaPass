import { ArrowIcon, Button, DisabledIcon, ProcessesIcon, SuccessIcon } from '@clients/shared';
import cn from 'classnames';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { routes } from '../../../helpers/routeHelpers.ts';
import { useAccountStore, useDocumentsStore, useProgressStore } from '../../../store';

import styles from './ResultBlock.module.pcss';
import { type ResultBlockProps } from './ResultBlock.props.ts';
import { ContactWidget, CourseWidget, DocumentWidget, PersonalWidget } from './widgets';

export function ResultBlock({ ...props }: ResultBlockProps) {
  const navigate = useNavigate();

  const [isOpened, setIsOpened] = useState<boolean>(false);

  const account = useAccountStore((state) => state.account);
  const status = useProgressStore((state) => state.myStatus);
  const fileNames = useDocumentsStore((state) => state.uploadedFileNames);

  const handleClick = () => setIsOpened(!isOpened);

  const validRoutes = {
    course: status && status.order > routes.course.order,
    contact: status && status.order > routes.contact.order,
    personal: status && status.order > routes.personal.order,
    documents: status && status.order >= routes.documents.order
  };

  const disabledRoute =
    (!status || status?.order < routes[props.type].order) && props.type !== 'course';

  const handleChangeBtnClick = () => {
    const routesMap = {
      course: routes.language.to,
      contact: routes.contact.to,
      personal: routes.personal.to,
      documents: routes.documents.to
    };
    navigate(routesMap[props.type]);
  };

  return (
    <div
      className={cn(styles.container, {
        [styles.disabledContainer]: disabledRoute,
        [styles.openedContainer]: isOpened
      })}
      onClick={handleClick}
    >
      <div className={styles.wrapper}>
        <div className={styles.nameWrapper}>
          {props.type === 'course' &&
            (disabledRoute ? (
              <DisabledIcon />
            ) : account?.courseId && validRoutes.course ? (
              <SuccessIcon />
            ) : (
              <ProcessesIcon />
            ))}

          {props.type === 'contact' &&
            (disabledRoute ? (
              <DisabledIcon />
            ) : account?.contactId && validRoutes.contact ? (
              <SuccessIcon />
            ) : (
              <ProcessesIcon />
            ))}

          {props.type === 'personal' &&
            (disabledRoute ? (
              <DisabledIcon />
            ) : account?.personalId && validRoutes.personal ? (
              <SuccessIcon />
            ) : (
              <ProcessesIcon />
            ))}

          {props.type === 'documents' &&
            (disabledRoute ? (
              <DisabledIcon />
            ) : fileNames.length > 0 && validRoutes.documents ? (
              <SuccessIcon />
            ) : (
              <ProcessesIcon />
            ))}

          {props.type === 'course' && <h2 className={styles.name}>Your course</h2>}
          {props.type === 'contact' && <h2 className={styles.name}>Your contact details</h2>}
          {props.type === 'personal' && <h2 className={styles.name}>Your personal details</h2>}
          {props.type === 'documents' && <h2 className={styles.name}>Your documents</h2>}
        </div>

        <div
          className={cn(styles.arrow, {
            [styles.openedArrow]: isOpened
          })}
        >
          <ArrowIcon width={25} height={25} />
        </div>
      </div>

      <div
        className={cn(styles.contentWrapper, {
          [styles.openedContentWrapper]: isOpened
        })}
      >
        <div
          className={cn(styles.bodyWrapper, {
            [styles.bodyWrapperOpened]: isOpened
          })}
        >
          {isOpened && (
            <>
              <div className={styles.body}>
                {props.type === 'course' && (
                  <CourseWidget
                    courseId={
                      account?.courseId != null && validRoutes.course ? account.courseId : null
                    }
                    opened={isOpened}
                  />
                )}
                {props.type === 'contact' && (
                  <ContactWidget
                    contactId={
                      account?.contactId != null && validRoutes.contact ? account.contactId : null
                    }
                    opened={isOpened}
                  />
                )}
                {props.type === 'personal' && (
                  <PersonalWidget
                    personalId={
                      account?.personalId != null && validRoutes.personal
                        ? account.personalId
                        : null
                    }
                    opened={isOpened}
                  />
                )}
              </div>
              {props.type === 'documents' && (
                <DocumentWidget fileNames={fileNames} opened={isOpened} />
              )}

              <div className={styles.btn} onClick={handleChangeBtnClick}>
                <Button name='Change' size='large' />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

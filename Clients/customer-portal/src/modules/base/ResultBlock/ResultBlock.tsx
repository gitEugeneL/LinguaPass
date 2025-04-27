import styles from './ResultBlock.module.pcss';
import ArrowIcon from '../../../assets/icons/ArrowIcon.tsx';
import cn from 'classnames';
import SuccessIcon from '../SchoolList/widgets/SchoolWidget/icons/SuccessIcon.tsx';
import { useState } from 'react';
import CourseWidget from './widgets/CourseWidget/CourseWidget.tsx';
import { useAccountStore } from '../../../store/account/account.store.ts';
import { ResultBlockProps } from './ResultBlock.props.ts';
import ProcessesIcon from '../SchoolList/widgets/SchoolWidget/icons/ProcessesIcon.tsx';
import Button from '../../../UI/Button/Button.tsx';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { routes } from '../../../helpers/routeHelpers.ts';
import { useNavigate } from 'react-router';

export default function ResultBlock({ ...props }: ResultBlockProps) {
  const navigate = useNavigate();

  const [isOpened, setIsOpened] = useState<boolean>(false);

  const account = useAccountStore((state) => state.account);
  const status = useProgressStore((state) => state.myStatus);

  const handleClick = () => {
    setIsOpened(!isOpened);
  };

  const handleChangeBtnClick = () => {
    const routesMap = {
      course: routes.language.to,
      contact: routes.school.to,
      personal: routes.course.to,
      documents: routes.personal.to
    };
    navigate(routesMap[props.type]);
  };

  return (
    <div
      className={cn(styles.container, {
        [styles.openedContainer]: isOpened
      })}
      onClick={handleClick}
    >
      <div className={styles.wrapper}>
        <div className={styles.nameWrapper}>
          {props.type === 'course' &&
            (account?.courseId && status && status.order > routes.course.order ? (
              <div className={styles.test}>
                <SuccessIcon />
              </div>
            ) : (
              <ProcessesIcon />
            ))}
          {props.type === 'contact' && (account?.contactId ? <SuccessIcon /> : <ProcessesIcon />)}
          {props.type === 'personal' && (account?.personalId ? <SuccessIcon /> : <ProcessesIcon />)}
          {/*todo add documents logic*/}
          {/*todo add documents logic*/}
          {/*todo add documents logic*/}
          {/*todo add documents logic*/}
          {/*todo add documents logic*/}
          {/*{props.type === 'documents' && (account?.documentsId ? <SuccessIcon /> : <ProcessesIcon />)}*/}

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
                      account?.courseId != null && status && status.order > routes.course.order
                        ? account.courseId
                        : null
                    }
                    opened={isOpened}
                  />
                )}
              </div>

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

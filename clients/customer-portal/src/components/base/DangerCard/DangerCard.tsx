import styles from './DangerCard.module.pcss';
import DangerIcon from '../../../assets/icons/DangerIcon.tsx';
import Button from '../../../UI/Button/Button.tsx';
import { DangerCardProps } from './DangerCard.props.ts';
import cn from 'classnames';
import { useEffect } from 'react';

export default function DangerCard({ ...props }: DangerCardProps) {
  const handleBtn1Click = () => {
    if (!props.btn1IsLoading) {
      props.btn1Action();
    }
  };

  const handleBtn2Click = () => {
    props.btn2Action();
  };

  useEffect(() => {
    const scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollPosition}px`;

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, scrollPosition);
    };
  }, []);

  return (
    <div className={cn(styles.modalOverlay)}>
      <div className={styles.card}>
        <DangerIcon />
        <h3 className={styles.title}>{props.title}</h3>
        <p className={styles.description}>{props.description}</p>
        <div className={styles.btnContainer}>
          <div onClick={handleBtn1Click}>
            <Button
              name={props.btn1Text}
              appearance={props.btn1IsLoading ? 'danger' : 'secondaryDanger'}
              size='large'
              isLoading={props.btn1IsLoading}
            />
          </div>
          <div onClick={handleBtn2Click}>
            <Button name={props.btn2Text} appearance='danger' size='large' />
          </div>
        </div>
      </div>
    </div>
  );
}

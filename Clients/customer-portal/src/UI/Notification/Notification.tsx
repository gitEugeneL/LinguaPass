import { NotificationProps } from './notification.pros.ts';
import { useEffect, useState } from 'react';
import styles from './Notification.module.pcss';
import { TIMER } from '../../helpers/contans.tsx';

export default function Notification({ message }: NotificationProps) {
  const [isShown, setIsShown] = useState<boolean>(false);
  const [isFading, setIsFading] = useState<boolean>(false);

  useEffect(() => {
    if (!message) {
      return;
    }
    setIsShown(true);
    const timerId = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsShown(false);
        setIsFading(false);
      }, 300);
    }, TIMER);
    return () => {
      clearTimeout(timerId);
    };
  }, [message]);

  if (!isShown) return null;

  return (
    <div className={`${styles.error} ${isFading ? styles.fadeOut : styles.fadeIn}`}>{message}</div>
  );
}

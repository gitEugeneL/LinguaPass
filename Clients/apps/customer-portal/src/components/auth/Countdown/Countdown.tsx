import { useEffect, useState } from 'react';

import styles from './Countdown.module.pcss';
import { type CountdownProps } from './Countdown.props.ts';

export function Countdown({ datetime }: CountdownProps) {
  const calculateTimeLeft = () => {
    const difference = new Date(datetime).getTime() - Date.now();
    return difference > 0
      ? {
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        }
      : null;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (!newTimeLeft) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [datetime]);

  if (!timeLeft) return null;

  return (
    <div className={styles.text}>
      code expires in{' '}
      <b>{`${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}</b>
    </div>
  );
}

import { LaptopIcon } from './icons/LaptopIcon.tsx';
import styles from './PhoneCard.module.pcss';

export function PhoneCard() {
  return (
    <div className={styles.container}>
      <LaptopIcon />
      <h3 className={styles.title}>Oops, Too Tiny!</h3>
      <p className={styles.description}>
        This admin panel is a bit too big for your phone's screen. 😄 Grab a tablet or laptop to
        enjoy the full experience!
      </p>
    </div>
  );
}

import InstagramIcon from './icons/InstagramIcon.tsx';
import TelegramIcon from './icons/TelegramIcon.tsx';
import WhatsAppIcon from './icons/WhatsAppIcon.tsx';
import styles from './MainFooter.module.pcss';

export function MainFooter() {
  return (
    <div className={styles.footer}>
      <div className={styles.mainWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <h3 className={styles.title}>LinguaPass</h3>
            <div className={styles.description}>
              Your trusted partner for language
              <br /> learning abroad. We help students
              <br /> worldwide master new languages
              <br /> through immersive international courses
            </div>
          </div>

          <div className={styles.container}>
            <h3 className={styles.title}>Company info</h3>
            <div className={styles.description}>
              <div>LinguaPass OÜ</div>
              <div>Registry code: 17543986</div>
              <div>Harju maakond, Tallinn,</div>
              <div>Lasnamäe linnaosa, Lõõtsa tn 8, 11415</div>
            </div>
          </div>

          <div className={styles.container}>
            <h3 className={styles.title}>How Can We Help?</h3>
            <div className={styles.description}>
              <div>linguapass@gmail.com</div>
              <div>support@linguapass.com</div>
              <div className={styles.iconWrapper}>
                <WhatsAppIcon />
                +37 245 789 012 Alex
              </div>
              <div className={styles.iconWrapper}>
                <WhatsAppIcon />
                +37 245 789 013 Maria
              </div>
            </div>
          </div>

          <div className={styles.container}>
            <h3 className={styles.title}>Follow Us On</h3>
            <div className={styles.icons}>
              <a href='#' target='_blank' className={styles.icon}>
                <InstagramIcon />
              </a>
              <a href='#' target='_blank' className={styles.icon}>
                <TelegramIcon />
              </a>
              <a href='#' target='_blank' className={styles.icon}>
                <WhatsAppIcon width={18} height={18} />
              </a>
            </div>
          </div>
        </div>
        <div className={styles.company}>
          © {new Date().getFullYear()} LinguaPass - All Rights Reserved
        </div>
      </div>
    </div>
  );
}

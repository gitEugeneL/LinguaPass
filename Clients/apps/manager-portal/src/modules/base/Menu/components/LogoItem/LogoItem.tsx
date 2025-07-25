import styles from './LogoItem.module.pcss';

export function LogoItem() {
  return (
    <div className={styles.container}>
      <div className={styles.logo}></div>
      <div className={styles.name}>LinguaPass</div>
    </div>
  );
}

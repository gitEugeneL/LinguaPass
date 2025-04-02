import styles from './AccountCard.module.pcss';
import ArrowIcon from '../../../../../assets/icons/ArrowIcon.tsx';
import NavItem from '../../UI/NavItem/NavItem.tsx';

export default function AccountCard() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.shortName}>eug@lihon.com</div>
        <div className={styles.nameSymbol}>EU</div>
        <div className={styles.arrow}>
          <ArrowIcon />
        </div>
        <div className={styles.fullName}>Firstname Lastname</div>
      </div>

      <ul className={styles.navBlock}>
        <NavItem name='My language' to='/languages' />
        <NavItem name='My school' to='/' disabled={true} />
        <NavItem name='My course' to='/' disabled={true} />
        <NavItem name='My contact info' to='/' disabled={true} />
        <NavItem name='My personal info' to='/' disabled={true} />
        <NavItem name='My documents' to='/' disabled={true} />
        <div className={styles.navBottom}>
          <NavItem name='My account' to='/' />
          <NavItem name='Logout' />
        </div>
      </ul>
    </div>
  );
}

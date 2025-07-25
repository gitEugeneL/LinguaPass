import { NavigatorWrapper } from './components';
import styles from './Navigator.module.pcss';
import { NavigatorItem } from './UI';

export function Navigator() {
  return (
    <ul className={styles.container}>
      <NavigatorItem name='Home' to='/home' />

      <NavigatorWrapper name='Programs'>
        <NavigatorItem name='Countries' to='/programs/countries' />
        <NavigatorItem name='Schools' to='/programs/schools' />
        <NavigatorItem name='Coursees' to='/programs/courses' />
      </NavigatorWrapper>

      <NavigatorWrapper name='Students'>
        <NavigatorItem name='Current' to='/students/current' />
        <NavigatorItem name='Archived' to='/students/archived' />
      </NavigatorWrapper>
    </ul>
  );
}

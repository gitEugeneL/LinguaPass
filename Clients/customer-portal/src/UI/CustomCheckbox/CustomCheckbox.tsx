import styles from './CustomCheckbox.module.pcss';
import { CustomCheckboxPops } from './CustomCheckbox.pops.ts';
import EnableIcon from './icons/EnableIcon.tsx';
import DisableIcon from './icons/DisableIcon.tsx';

export default function CustomCheckbox({ ...props }: CustomCheckboxPops) {
  return (
    <label className={styles.label}>
      <input
        className={styles.input}
        type='checkbox'
        checked={props.checked}
        onChange={props.onChange}
      />
      <span className={styles.checkbox}>{props.checked ? <DisableIcon /> : <EnableIcon />}</span>
      {props.label}
    </label>
  );
}

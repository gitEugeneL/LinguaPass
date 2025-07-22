import styles from './CustomFieldset.module.pcss';
import { type CustomFieldsetProps } from './CustomFieldset.props.ts';
import { Controller } from 'react-hook-form';
import cn from 'classnames';
import DisableIcon from './icons/DisableIcon.tsx';
import EnableIcon from './icons/EnableIcon.tsx';

export default function CustomFieldset({ label, name, control, options }: CustomFieldsetProps) {
  return (
    <div>
      {label && <div className={styles.label}>{label}</div>}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref } }) => (
          <fieldset className={styles.fieldset}>
            {options.map((option) => (
              <label
                key={option.value}
                className={cn(styles.radioLabel, {
                  [styles.checked]: value === option.value
                })}
              >
                <input
                  type='radio'
                  name={name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                  ref={ref}
                  className={styles.input}
                />
                {value === option.value ? <DisableIcon /> : <EnableIcon />}
                {option.label}
              </label>
            ))}
          </fieldset>
        )}
      />
    </div>
  );
}

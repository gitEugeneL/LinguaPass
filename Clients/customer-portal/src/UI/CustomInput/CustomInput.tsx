import styles from './Input.module.pcss';
import cn from 'classnames';
import { CustomInputProps } from './CustomInput.props.tsx';
import { Controller } from 'react-hook-form';

export default function CustomInput({ label, name, control, errors, ...props }: CustomInputProps) {
  return (
    <div>
      {label && <div className={styles.label}>{label}</div>}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <input
            className={cn(styles.input, {
              [styles.inputError]: errors[name]?.message
            })}
            {...props}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            ref={ref}
          />
        )}
      />

      <div className={styles.errorBlock}>
        {errors[name]?.message && (
          <span className={styles.errorText}>{(errors[name] as { message?: string }).message}</span>
        )}
      </div>
    </div>
  );
}

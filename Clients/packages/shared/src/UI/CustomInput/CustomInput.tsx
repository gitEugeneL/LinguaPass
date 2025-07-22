import styles from './CustomInput.module.pcss';
import { type CustomInputProps } from './CustomInput.props.tsx';
import { Controller } from 'react-hook-form';
import cn from 'classnames';

export function CustomInput({
  label,
  name,
  control,
  errors,
  disabled = false,
  ...props
}: CustomInputProps) {
  return (
    <div>
      {label && <div className={styles.label}>{label}</div>}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <input
            className={cn(styles.input, {
              [styles.inputError]: errors[name]?.message,
              [styles.disabled]: disabled
            })}
            {...props}
            value={value}
            onBlur={onBlur}
            onChange={onChange}
            ref={ref}
            disabled={disabled}
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

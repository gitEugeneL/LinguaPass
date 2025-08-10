import cn from 'classnames';
import { Controller } from 'react-hook-form';

import styles from './CustomTextarea.module.pcss';
import type { CustomTextareaProps } from './CustomTextarea.props.ts';

export function CustomTextarea({
  label,
  name,
  control,
  errors,
  disabled = false,
  maxSize,
  ...props
}: CustomTextareaProps) {
  return (
    <div>
      {label && <div className={styles.label}>{label}</div>}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <>
            <textarea
              className={cn(styles.textarea, {
                [styles.textareaError]: errors[name]?.message,
                [styles.disabled]: disabled
              })}
              {...props}
              value={value}
              onBlur={onBlur}
              onChange={onChange}
              ref={ref}
              disabled={disabled}
            />
            <div className={styles.size}>
              {value?.length || 0}/{maxSize || '∞'}
            </div>
          </>
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

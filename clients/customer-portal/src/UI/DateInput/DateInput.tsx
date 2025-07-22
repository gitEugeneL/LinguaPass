import styles from './DateInput.module.pcss';
import DatePicker from 'react-datepicker';
import { DateInputProps } from './DateInput.props.ts';
import { Controller } from 'react-hook-form';
import cn from 'classnames';

export default function DateInput({ ...props }: DateInputProps) {
  return (
    <div className={styles.container}>
      <div className={styles.label}>{props.label}</div>

      <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => (
          <DatePicker
            className={cn(styles.dateInput, {
              [styles.inputError]: props.errors[props.name]?.message
            })}
            selected={field.value instanceof Date ? field.value : null}
            onChange={(date: Date | null) => field.onChange(date)}
            placeholderText={props.placeholder}
            dateFormat='MM/dd/yyyy'
            showPopperArrow={false}
            maxDate={new Date(new Date().setDate(new Date().getDate() - 1))}
            popperPlacement='bottom-start'
          />
        )}
      />
      <div className={styles.errorBlock}>
        {props.errors[props.name]?.message && (
          <span className={styles.errorText}>
            {(props.errors[props.name] as { message?: string }).message}
          </span>
        )}
      </div>
    </div>
  );
}

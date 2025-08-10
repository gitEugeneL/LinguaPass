import cn from 'classnames';
import { Controller } from 'react-hook-form';

import styles from './LanguageFieldset.module.pcss';
import type { LanguageFieldsetProps } from './LanguageFieldset.props.ts';

export function LanguageFieldset({
  label,
  name,
  control,
  options,
  errors,
  type = 'checkbox'
}: LanguageFieldsetProps) {
  const languageCodeMap: { [key: string]: string } = {
    English: 'en',
    Spanish: 'es',
    French: 'fr',
    German: 'de',
    Italian: 'it',
    Japanese: 'ja',
    Chinese: 'zh',
    Portugal: 'pt'
  };

  return (
    <div>
      {label && <div className={styles.label}>{label}</div>}

      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value = type === 'checkbox' ? [] : '', ref } }) => (
          <fieldset className={styles.fieldset}>
            {options.map((option) => {
              const languageCode = languageCodeMap[option.label];
              const isChecked =
                type === 'checkbox'
                  ? Array.isArray(value) && value.includes(option.value)
                  : value === option.value;

              return (
                <label
                  key={option.value}
                  className={cn(type === 'checkbox' ? styles.checkboxLabel : styles.radioLabel, {
                    [styles.checked]: isChecked,
                    [styles[languageCode]]: isChecked
                  })}
                >
                  <input
                    type={type === 'checkbox' ? 'checkbox' : 'radio'}
                    name={name}
                    value={option.value}
                    checked={isChecked}
                    onChange={(e) => {
                      if (type === 'checkbox') {
                        const newValue = e.target.checked
                          ? [...(Array.isArray(value) ? value : []), option.value]
                          : (value as string[]).filter((v: string) => v !== option.value);
                        onChange(newValue);
                      } else {
                        onChange(option.value);
                      }
                    }}
                    ref={ref}
                    className={styles.input}
                  />
                  {option.label}
                </label>
              );
            })}

            <div className={styles.errorBlock}>
              {errors[name]?.message && (
                <span className={styles.errorText}>
                  {(errors[name] as { message?: string }).message}
                </span>
              )}
            </div>
          </fieldset>
        )}
      />
    </div>
  );
}

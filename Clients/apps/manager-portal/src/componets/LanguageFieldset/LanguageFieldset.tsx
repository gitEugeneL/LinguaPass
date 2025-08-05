import cn from 'classnames';
import { Controller } from 'react-hook-form';

import styles from './LanguageFieldset.module.pcss';
import type { LanguageFieldsetProps } from './LanguageFieldset.props.ts';

export function LanguageFieldset({ label, name, control, options, errors }: LanguageFieldsetProps) {
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
        render={({ field: { onChange, value = [], ref } }) => (
          <fieldset className={styles.fieldset}>
            {options.map((option) => {
              const languageCode = languageCodeMap[option.label] || 'fallback';
              return (
                <label
                  key={option.value}
                  className={cn(styles.checkboxLabel, {
                    [styles.checked]: value.includes(option.value),
                    [styles[languageCode]]: value.includes(option.value)
                  })}
                >
                  <input
                    type='checkbox'
                    name={name}
                    value={option.value}
                    checked={value.includes(option.value)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...value, option.value]
                        : value.filter((v: string) => v !== option.value);
                      onChange(newValue);
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

import { useEffect, useRef, useState } from 'react';
import styles from './CustomSelect.module.pcss';
import { type CustomSelectProps } from './CustomSelect.props.ts';
import { Controller } from 'react-hook-form';
import cn from 'classnames';

export default function CustomSelect({ ...props }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef}>
      {props.label && <div className={styles.label}>{props.label}</div>}

      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { onChange, value, ref } }) => (
          <div className={styles.selectWrapper}>
            <div
              className={cn(styles.select, {
                [styles.hasValue]: !!value,
                [styles.open]: isOpen
              })}
              onClick={() => setIsOpen(!isOpen)}
              ref={ref}
            >
              {props.options.find((opt) => opt.value === value)?.label || 'Select an option'}
            </div>
            <div
              className={cn(styles.dropdown, {
                [styles.open]: isOpen
              })}
            >
              {props.options.map((option) => (
                <div
                  key={option.value}
                  className={cn(styles.option, {
                    [styles.selected]: option.value === value
                  })}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      />
    </div>
  );
}

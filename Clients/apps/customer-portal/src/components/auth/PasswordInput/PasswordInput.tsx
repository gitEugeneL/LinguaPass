import { CustomInput } from '@clients/shared';
import { useState } from 'react';

import { CloseIcon } from './icons/CloseIcon.tsx';
import { OpenIcon } from './icons/OpenIcon.tsx';
import styles from './PasswordInput.module.pcss';
import { type PasswordInputProps } from './PasswordInput.props.ts';

export function PasswordInput({ label, name, control, errors, ...props }: PasswordInputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const handlePressIcon = () => {
    setIsPasswordVisible((state) => !state);
  };

  return (
    <div className={styles.container}>
      <CustomInput
        type={isPasswordVisible ? 'text' : 'password'}
        label={label}
        name={name}
        control={control}
        errors={errors}
        {...props}
      />

      <div className={styles.icon} onClick={handlePressIcon}>
        {isPasswordVisible ? <OpenIcon /> : <CloseIcon />}
      </div>
    </div>
  );
}

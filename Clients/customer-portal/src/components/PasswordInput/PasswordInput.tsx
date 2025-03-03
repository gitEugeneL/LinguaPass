import { PasswordInputProps } from './PasswordInput.props.ts';
import { useState } from 'react';
import CustomInput from '../../UI/CustomInput/CustomInput.tsx';
import { OpenIcon } from './icons/OpenIcon.tsx';
import { CloseIcon } from './icons/CloseIcon.tsx';
import styles from './PasswordInput.module.pcss';

export default function PasswordInput({
  label,
  name,
  control,
  errors,
  ...props
}: PasswordInputProps) {
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

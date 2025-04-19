import styles from './OptionalInput.module.pcss';
import { useState } from 'react';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import { OptionalInputProps } from './OptionalInput.props.ts';
import CustomCheckbox from '../../../UI/CustomCheckbox/CustomCheckbox.tsx';

export default function OptionalInput({
  label,
  checkboxLabel,
  name,
  control,
  errors,
  resetField,
  ...props
}: OptionalInputProps) {
  const [isInputEnable, setInputEnable] = useState<boolean>(false);
  const handleCheckboxChange = () => {
    if (isInputEnable) {
      resetField(name);
    }
    setInputEnable((state) => !state);
  };

  return (
    <div className={styles.conainer}>
      <CustomInput label={label} name={name} control={control} errors={errors} {...props} disabled={!isInputEnable} />
      <CustomCheckbox checked={isInputEnable} onChange={handleCheckboxChange} label={checkboxLabel} />
    </div>
  );
}

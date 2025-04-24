import styles from './OptionalInput.module.pcss';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import { OptionalInputProps } from './OptionalInput.props.ts';
import CustomCheckbox from '../../../UI/CustomCheckbox/CustomCheckbox.tsx';

export default function OptionalInput({
  label,
  checkboxLabel,
  name,
  control,
  errors,
  setValue,
  isInputEnabled,
  setInputEnabled,
  ...props
}: OptionalInputProps) {
  const handleCheckboxChange = () => {
    if (isInputEnabled) {
      setValue(name, '');
    }
    setInputEnabled(!isInputEnabled);
  };

  return (
    <div className={styles.container}>
      <CustomInput
        label={label}
        name={name}
        control={control}
        errors={errors}
        {...props}
        disabled={!isInputEnabled}
      />
      <div className={styles.checkbox}>
        <CustomCheckbox
          checked={isInputEnabled}
          onChange={handleCheckboxChange}
          label={checkboxLabel}
        />
      </div>
    </div>
  );
}

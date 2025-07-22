import { CodeInputProps } from './CodeInput.props.ts';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import styles from './CodeInput.module.pcss';

export default function CodeInput({ name, control, errors, ...props }: CodeInputProps) {
  return (
    <CustomInput
      className={styles.input}
      name={name}
      maxLength={1}
      control={control}
      errors={errors}
      {...props}
    />
  );
}

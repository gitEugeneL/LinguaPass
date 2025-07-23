import { CustomInput } from '@clients/shared';

import styles from './CodeInput.module.pcss';
import { type CodeInputProps } from './CodeInput.props.ts';

export function CodeInput({ name, control, errors, ...props }: CodeInputProps) {
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

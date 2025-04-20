import styles from './ContactForm.module.pcss';
import {
  ContactFormDefaultValues,
  ContactFormSchema,
  createContactFormValidationSchema
} from './ContactFormSchema.ts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import OptionalInput from '../../../components/base/OptionalInput/OptionalInput.tsx';
import CustomFieldset from '../../../UI/CustomFieldset/CustomFieldset.tsx';
import { useMemo, useState } from 'react';
import CustomCheckbox from '../../../UI/CustomCheckbox/CustomCheckbox.tsx';
import cn from 'classnames';
import Button from '../../../UI/Button/Button.tsx';

export default function ContactForm() {
  const [corrAddrExists, setCorrAddrExists] = useState<boolean>(false);

  const handleCorrespondAddrExistsChange = () => {
    resetField('corrStreet');
    resetField('corrHsApt');
    resetField('corrCity');
    resetField('corrCountry');
    resetField('corrPostcode');
    setCorrAddrExists(!corrAddrExists);
  };

  const formSubmit = async (schema: ContactFormSchema) => {
    console.log(schema);
    // todo reset form
    // todo redirect if result ok
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    resetField
  } = useForm<ContactFormSchema>({
    resolver: yupResolver(
      useMemo(() => createContactFormValidationSchema(corrAddrExists), [corrAddrExists])
    ),
    mode: 'all',
    defaultValues: ContactFormDefaultValues
  });

  return (
    <div className={styles.container}>
      {/*// todo return notification*/}

      <form className={styles.wrapper} onSubmit={handleSubmit(formSubmit)}>
        <div className={styles.leftBlock}>
          <CustomInput
            name='name'
            control={control}
            errors={errors}
            label='Name'
            placeholder='Enter your name'
          />
          <CustomInput
            name='surname'
            control={control}
            errors={errors}
            label='Surname'
            placeholder='Enter your surname'
          />
          <OptionalInput
            name='middleName'
            control={control}
            errors={errors}
            resetField={resetField}
            label='Middle name'
            checkboxLabel='No middle name'
            placeholder='Enter your middle name'
          />
          <OptionalInput
            name='maidenName'
            control={control}
            errors={errors}
            resetField={resetField}
            label='Maiden name'
            checkboxLabel='No maiden name'
            placeholder='Enter your maiden name'
          />

          <CustomFieldset
            name='gender'
            control={control}
            label='Gender'
            options={[
              { value: 'female', label: 'female' },
              { value: 'male', label: 'male' }
            ]}
          />

          <CustomInput
            name='phone'
            control={control}
            errors={errors}
            label='Phone (with country code)'
            placeholder='Enter your phone'
          />

          <CustomFieldset
            name='typeOfSettlement'
            control={control}
            label='Type of settlement'
            options={[
              { value: 'city', label: 'city' },
              { value: 'village', label: 'village' }
            ]}
          />
        </div>
        <div className={styles.rightBlock}>
          <CustomInput
            name='street'
            control={control}
            errors={errors}
            label='Street'
            placeholder='Enter your street'
          />
          <CustomInput
            name='hsApt'
            control={control}
            errors={errors}
            label='Hs/apt'
            placeholder='Enter your house and apartment'
          />
          <CustomInput
            name='city'
            control={control}
            errors={errors}
            label='City'
            placeholder='Enter your city'
          />
          <CustomInput
            name='country'
            control={control}
            errors={errors}
            label='Country'
            placeholder='Enter your country'
          />
          <CustomInput
            name='postcode'
            control={control}
            errors={errors}
            label='Postcode'
            placeholder='Enter your postcode'
          />
          <CustomCheckbox
            checked={corrAddrExists}
            label={'The correspondence is the same'}
            onChange={handleCorrespondAddrExistsChange}
          />

          <div
            className={cn(styles.corrWrapper, {
              [styles.corrWrapperActive]: corrAddrExists
            })}
          >
            {corrAddrExists && (
              <>
                <CustomInput
                  name='corrStreet'
                  control={control}
                  errors={errors}
                  label='Corr. street'
                  placeholder='Enter your corr. street'
                />

                <CustomInput
                  name='corrHsApt'
                  control={control}
                  errors={errors}
                  label='Corr. hs/apt'
                  placeholder='Enter your corr. hourse'
                />

                <CustomInput
                  name='corrCity'
                  control={control}
                  errors={errors}
                  label='Corr. city'
                  placeholder='Enter your corr. city'
                />

                <CustomInput
                  name='corrCountry'
                  control={control}
                  errors={errors}
                  label='Corr. country'
                  placeholder='Enter your corr. country'
                />

                <CustomInput
                  name='corrPostcode'
                  control={control}
                  errors={errors}
                  label='Corr. postcode'
                  placeholder='Enter your corr. postcode'
                />
              </>
            )}
          </div>

          <div className={styles.btn}>
            <Button name='Next -->' size='large' />
          </div>
        </div>
      </form>
    </div>
  );
}

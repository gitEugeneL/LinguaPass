import styles from './ContactForm.module.pcss';
import {
  contactDefaultValues,
  ContactFormSchema,
  createContactFormValidationSchema
} from './ContactFormSchema.ts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import OptionalInput from '../../../components/base/OptionalInput/OptionalInput.tsx';
import CustomFieldset from '../../../UI/CustomFieldset/CustomFieldset.tsx';
import { useEffect, useMemo, useState } from 'react';
import CustomCheckbox from '../../../UI/CustomCheckbox/CustomCheckbox.tsx';
import cn from 'classnames';
import Button from '../../../UI/Button/Button.tsx';
import { useContactStore } from '../../../store/contact/contact.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { routes } from '../../../helpers/routeHelpers.ts';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useAccountStore } from '../../../store/account/account.store.ts';
import { useNavigate } from 'react-router';

export default function ContactForm() {
  const navigate = useNavigate();
  const [corrAddrExists, setCorrAddrExists] = useState<boolean>(false);
  const [middleNameExists, setMiddleNameExists] = useState<boolean>(false);
  const [maidenNameExists, setMaidenNameExists] = useState<boolean>(false);

  const account = useAccountStore((store) => store.account);

  const { myStatus, changeStep } = useProgressStore(
    useShallow((state) => ({
      myStatus: state.myStatus,
      changeStep: state.changeStep
    }))
  );

  const { contact, getCurrentContact, isLoading, createContact } = useContactStore(
    useShallow((state) => ({
      contact: state.contact,
      isLoading: state.isLoading,
      createContact: state.createContact,
      getCurrentContact: state.getCurrentContact
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      const isOrderCorrect = myStatus && myStatus.order >= routes.personal.order;
      const contactId = account?.contactId;
      if (isOrderCorrect && contactId && !contact) {
        await getCurrentContact();
      }
    };
    fetchData();
  }, [account?.contactId]);

  useEffect(() => {
    if (contact) {
      setValue('name', contact.name || '');
      setValue('surname', contact.surname || '');
      setValue('middleName', contact.middleName || '');
      setValue('maidenName', contact.maidenName || '');
      setValue('gender', contact.gender || 'male');
      setValue('phone', contact.phone || '');
      setValue('typeOfSettlement', contact.typeOfSettlement || 'city');
      setValue('street', contact.street || '');
      setValue('hsApt', contact.hsApt || '');
      setValue('city', contact.city || '');
      setValue('country', contact.country || '');
      setValue('postcode', contact.postcode || '');
      setValue('corrStreet', contact.corrStreet || '');
      setValue('corrHsApt', contact.corrHsApt || '');
      setValue('corrCity', contact.corrCity || '');
      setValue('corrCountry', contact.corrCountry || '');
      setValue('corrPostcode', contact.corrPostcode || '');

      if (contact.corrCity || contact.corrCountry || contact.corrPostcode || contact.corrStreet) {
        setCorrAddrExists(true);
      }
      if (contact.middleName) {
        setMiddleNameExists(true);
      }
      if (contact.maidenName) {
        setMaidenNameExists(true);
      }
    }
  }, [contact]);

  const handleCorrespondAddrExistsChange = () => {
    setValue('corrStreet', '');
    setValue('corrHsApt', '');
    setValue('corrCity', '');
    setValue('corrCountry', '');
    setValue('corrPostcode', '');
    setCorrAddrExists(!corrAddrExists);
  };

  const formSubmit = async (schema: ContactFormSchema) => {
    const isOrderCorrect = myStatus && myStatus.order >= routes.contact.order;
    if (isOrderCorrect) {
      const isUnchanged =
        contact !== null &&
        (Object.keys(schema) as (keyof ContactFormSchema)[]).every(
          (key) => schema[key] === contact[key]
        );
      if (isUnchanged && myStatus && myStatus.order > routes.contact.order) {
        navigate(routes.personal.to);
        return;
      } else {
        if (!isLoading) {
          await createContact({ ...schema }).then(() => {
            changeStep(routes.personal.order);
            navigate(routes.personal.to);
          });
        }
      }
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<ContactFormSchema>({
    resolver: yupResolver(
      useMemo(() => createContactFormValidationSchema(corrAddrExists), [corrAddrExists])
    ),
    mode: 'all',
    defaultValues: contactDefaultValues
  });

  return (
    <div className={styles.container}>
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
            setValue={setValue}
            isInputEnabled={middleNameExists}
            setInputEnabled={setMiddleNameExists}
            label='Middle name'
            checkboxLabel='No middle name'
            placeholder='Enter your middle name'
          />
          <OptionalInput
            name='maidenName'
            control={control}
            errors={errors}
            setValue={setValue}
            isInputEnabled={maidenNameExists}
            setInputEnabled={setMaidenNameExists}
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
            <Button name='Next -->' size='large' isLoading={isLoading} />
          </div>
        </div>
      </form>
    </div>
  );
}

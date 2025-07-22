import styles from './PersonalForm.module.pcss';
import DateInput from '../../../UI/DateInput/DateInput.tsx';
import CustomInput from '../../../UI/CustomInput/CustomInput.tsx';
import { useForm } from 'react-hook-form';
import {
  personalDefaultValues,
  PersonalFormSchema,
  PersonalFormValidationSchema
} from './PersonalFormSchema.ts';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomSelect from '../../../UI/CustomSelect/CustomSelect.tsx';
import Button from '../../../UI/Button/Button.tsx';
import { useNavigate } from 'react-router';
import { useAccountStore } from '../../../store/account/account.store.ts';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { usePersonalStore } from '../../../store/personal/personal.store.ts';
import { useEffect } from 'react';
import { routes } from '../../../helpers/routeHelpers.ts';

export default function PersonalForm() {
  const navigate = useNavigate();

  const account = useAccountStore((store) => store.account);

  const { myStatus, changeStep } = useProgressStore(
    useShallow((state) => ({
      myStatus: state.myStatus,
      changeStep: state.changeStep
    }))
  );

  const { personal, isLoading, getCurrentPersonal, createPersonal } = usePersonalStore(
    useShallow((state) => ({
      personal: state.personal,
      isLoading: state.isLoading,
      getCurrentPersonal: state.getCurrentPersonal,
      createPersonal: state.createPersonal
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      const isOrderCorrect = myStatus && myStatus.order >= routes.documents.order;
      const personalId = account?.personalId;
      if (isOrderCorrect && personalId && !personal) {
        await getCurrentPersonal();
      }
    };
    fetchData();
  }, [account?.personalId]);

  useEffect(() => {
    if (personal) {
      setValue('birthday', new Date(personal.birthday));
      setValue('birthPlace', personal.birthPlace || '');
      setValue('countryOfBirth', personal.countryOfBirth || '');
      setValue('fathersName', personal.fathersName || '');
      setValue('mothersName', personal.mothersName || '');
      setValue('nationality', personal.nationality || '');
      setValue('idNumber', personal.idNumber || '');
      setValue('countryOfIssue', personal.countryOfIssue || '');
      setValue('contactName', personal.contactName || '');
      setValue('contactSurname', personal.contactSurname || '');
      setValue('relationship', personal.relationship || '');
      setValue('contactPhone', personal.contactPhone || '');
      setValue('educationLevel', personal.educationLevel || 'secondary');
    }
  }, [personal]);

  const formSubmit = async (schema: PersonalFormSchema) => {
    const isOrderCorrect = myStatus && myStatus.order >= routes.personal.order;
    if (isOrderCorrect) {
      const isUnchanged =
        personal != null &&
        (Object.keys(schema) as (keyof PersonalFormSchema)[]).every((key) => {
          const schemaValue =
            key === 'birthday' ? new Date(schema.birthday).toISOString() : schema[key];
          const personalValue =
            key === 'birthday'
              ? personal.birthday
                ? new Date(personal.birthday).toISOString()
                : ''
              : personal[key];
          return schemaValue === personalValue;
        });
      if (isUnchanged && myStatus && myStatus.order > routes.personal.order) {
        navigate(routes.documents.to);
        return;
      } else {
        if (!isLoading) {
          await createPersonal({ ...schema }).then(() => {
            changeStep(routes.documents.order);
            navigate(routes.documents.to);
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
  } = useForm<PersonalFormSchema>({
    resolver: yupResolver(PersonalFormValidationSchema),
    mode: 'all',
    defaultValues: personalDefaultValues
  });

  return (
    <div className={styles.container}>
      <form className={styles.wrapper} onSubmit={handleSubmit(formSubmit)}>
        <div className={styles.leftBlock}>
          <CustomInput
            name='fathersName'
            control={control}
            errors={errors}
            label='Father’s name'
            placeholder='Enter your father’s name'
          />
          <CustomInput
            name='mothersName'
            control={control}
            errors={errors}
            label='Mother’s name'
            placeholder='Enter your mother’s name'
          />
          <DateInput
            name='birthday'
            control={control}
            errors={errors}
            label='Birthday'
            placeholder='mm/dd/yyyy'
          />
          <CustomInput
            name='birthPlace'
            control={control}
            errors={errors}
            label='Birth place. Place enter the city'
            placeholder='Enter your birth place'
          />
          <CustomInput
            name='countryOfBirth'
            control={control}
            errors={errors}
            label='Country of birth'
            placeholder='Enter your country of birth'
          />
          <CustomInput
            name='nationality'
            control={control}
            errors={errors}
            label='Nationality'
            placeholder='Enter your nationality'
          />

          <CustomSelect
            name='educationLevel'
            control={control}
            label='Education level'
            options={[
              { value: 'secondary', label: 'Secondary education' },
              { value: 'bachelor', label: 'Bachelor degree' },
              { value: 'master', label: 'Master degree' },
              { value: 'phd', label: 'PhD' }
            ]}
          />
        </div>

        <div className={styles.rightBlock}>
          <CustomInput
            name='idNumber'
            control={control}
            errors={errors}
            label='ID number'
            placeholder='Enter your ID number'
          />
          <CustomInput
            name='countryOfIssue'
            control={control}
            errors={errors}
            label='Country of issue'
            placeholder='Enter your country of issue'
          />

          <span className={styles.label}>
            Completing the fields below is for your safety. In the event of an accident or illness,
            please notify:
          </span>

          <CustomInput
            name='contactName'
            control={control}
            errors={errors}
            label='Contact name'
            placeholder='Enter your contact name'
          />
          <CustomInput
            name='contactSurname'
            control={control}
            errors={errors}
            label='Contact surname'
            placeholder='Enter your contact surname'
          />
          <CustomInput
            name='relationship'
            control={control}
            errors={errors}
            label='Relationship'
            placeholder='Enter relationship'
          />
          <CustomInput
            name='contactPhone'
            control={control}
            errors={errors}
            label='Contact phone'
            placeholder='Enter your contact phone number'
          />

          <div className={styles.btn}>
            <Button name='Next -->' size='large' isLoading={isLoading} />
          </div>
        </div>
      </form>
    </div>
  );
}

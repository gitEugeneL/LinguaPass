import { Button, CustomInput, Notification } from '@clients/shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { LanguageFieldset, PreviewCard } from '../../../../../componets';
import { useCountryStore, useLanguageStore, useSchoolStore } from '../../../../../store';

import styles from './AddEditSchoolForm.module.pcss';
import type { AddEditSchoolFormProps } from './AddEditSchoolForm.props.ts';
import {
  type AddEditSchoolFormSchema,
  AddEditSchoolFormValidationSchema
} from './AddEditSchoolFromSchema.ts';

export function AddEditSchoolForm({ schoolId = undefined }: AddEditSchoolFormProps) {
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const { isLoading, currentSchool, createSchool, updateSchool, error, resetError } =
    useSchoolStore(
      useShallow((state) => ({
        isLoading: state.isLoading,
        error: state.error,
        currentSchool: state.currentSchool,
        createSchool: state.createSchool,
        updateSchool: state.updateSchool,
        resetError: state.resetError
      }))
    );

  const currentCountry = useCountryStore((state) => state.currentCountry);

  const { languages, getLanguages } = useLanguageStore(
    useShallow((state) => ({
      languages: state.languages,
      getLanguages: state.getLanguages
    }))
  );

  useEffect(() => {
    if (languages.length === 0) {
      getLanguages();
    }
  }, [languages, getLanguages, schoolId]);

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => {
        setLocalError(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
    resetError();
  }, [error, resetError]);

  useEffect(() => {
    if (currentSchool && schoolId === currentSchool.schoolId) {
      setValue('name', currentSchool.name);
      setValue('shortName', currentSchool.shortName);
      setValue('city', currentSchool.city);
      setValue(
        'languages',
        currentSchool.languages.map((l) => l.languageId)
      );
    }
  }, [currentSchool, schoolId]);

  const {
    control,
    watch,
    handleSubmit,
    setFocus,
    setValue,
    setError,
    formState: { errors }
  } = useForm<AddEditSchoolFormSchema>({
    resolver: yupResolver(AddEditSchoolFormValidationSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      shortName: '',
      city: '',
      languages: []
    }
  });

  const schoolName = watch('name');
  const shortName = watch('shortName');
  const city = watch('city');
  const selectedLanguages = watch('languages');

  const formSubmit = async (schema: AddEditSchoolFormSchema) => {
    if (!isLoading && currentCountry) {
      setLocalError(undefined);
      try {
        if (schoolId && currentSchool && currentSchool.schoolId === schoolId) {
          await updateSchool({
            schoolId: currentSchool.schoolId,
            name: schema.name,
            shortName: schema.shortName,
            city: schema.city,
            isActive: currentSchool.isActive,
            countryId: currentSchool.countryId,
            languageIds: selectedLanguages
          });
        } else if (!schoolId) {
          await createSchool({
            name: schema.name,
            shortName: schema.shortName,
            city: schema.city,
            isActive: true,
            countryId: currentCountry.countryId,
            languageIds: selectedLanguages
          });
        }
        navigate(`/programs/schools/${currentCountry.countryId}`);
      } catch (error) {
        if (error instanceof AxiosError) {
          const result: string = error.response?.data;
          if (result === 'This name already exists') {
            setError('name', { message: result });
            setFocus('name');
          } else if (result === 'This short name already exists') {
            setError('shortName', { message: result });
            setFocus('shortName');
          }
        }
      }
    }
  };

  const languageOptions = languages.map((language) => ({
    value: language.languageId,
    label: language.name
  }));

  const selectedLanguageNames = selectedLanguages.map(
    (languageId) => languageOptions.find((option) => option.value === languageId)?.label || ''
  );

  // todo

  return (
    <div className={styles.wrapper}>
      <div className={styles.notification}>
        <Notification message={localError} />
      </div>

      <div
        className={cn(styles.container, {
          [styles.error]: localError
        })}
      >
        <div className={styles.card}>
          <form onSubmit={handleSubmit(formSubmit)}>
            <CustomInput
              name='name'
              label='Unique school name*'
              placeholder='Enter new unique school name'
              control={control}
              errors={errors}
              maxLength={50}
            />

            <CustomInput
              name='shortName'
              label='Enter unique short name*'
              placeholder='Unique short name*'
              control={control}
              errors={errors}
              maxLength={10}
            />

            <CustomInput
              name='city'
              label={`City* ${currentCountry ? `(${currentCountry.name})` : ''}`}
              placeholder='Enter city'
              control={control}
              errors={errors}
              maxLength={20}
            />

            <LanguageFieldset
              label='Available languages*'
              name='languages'
              control={control}
              options={languageOptions}
              errors={errors}
            />

            <Button name={schoolId ? 'Update' : 'Create'} size='large' isLoading={isLoading} />
          </form>
        </div>
        <PreviewCard
          appearance='school'
          name={schoolName}
          shortName={shortName}
          city={city}
          languages={selectedLanguageNames}
          country={currentCountry?.name}
          isActiveStatus={currentSchool ? currentSchool.isActive : false}
          count={currentSchool ? currentSchool.tracksCount : 0}
          isCreate={!schoolId}
        />
      </div>
    </div>
  );
}

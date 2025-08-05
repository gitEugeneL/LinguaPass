import { Button, CustomInput, Notification } from '@clients/shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { PreviewCard } from '../../../../../componets';
import { useCountryStore } from '../../../../../store';

import styles from './AddEditCountryForm.module.pcss';
import type { AddEditCountryFormProps } from './AddEditCountryForm.props.ts';
import {
  type AddEditCountryFormSchema,
  AddEditCountryFormValidationSchema
} from './AddEditCountryFormSchema.ts';

export function AddEditCountryForm({ countryId = undefined }: AddEditCountryFormProps) {
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const navigate = useNavigate();

  const { isLoading, currentCountry, createCountry, updateCountry, error, resetError } =
    useCountryStore(
      useShallow((state) => ({
        isLoading: state.isLoading,
        error: state.error,
        currentCountry: state.currentCountry,
        createCountry: state.createCountry,
        updateCountry: state.updateCountry,
        resetError: state.resetError
      }))
    );

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
    if (currentCountry && countryId === currentCountry.countryId) {
      setValue('name', currentCountry.name);
    }
  }, [currentCountry, countryId]);

  const {
    control,
    watch,
    handleSubmit,
    setFocus,
    setValue,
    setError,
    formState: { errors }
  } = useForm<AddEditCountryFormSchema>({
    resolver: yupResolver(AddEditCountryFormValidationSchema),
    mode: 'all',
    defaultValues: {
      name: ''
    }
  });

  const countryName = watch('name');

  const formSubmit = async (schema: AddEditCountryFormSchema) => {
    if (!isLoading) {
      setLocalError(undefined);
      try {
        if (countryId && currentCountry && currentCountry.countryId === countryId) {
          await updateCountry({
            countryId: currentCountry.countryId,
            name: schema.name,
            isActive: currentCountry.isActive
          });
        } else if (!countryId) {
          await createCountry({ name: schema.name, isActive: true });
        }
        navigate('/programs/countries');
      } catch (error) {
        if (error instanceof AxiosError) {
          setError('name', {
            message: error.response?.data
          });
          setFocus('name');
        }
        if (!countryId) {
          setValue('name', '');
        }
      }
    }
  };

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
              label='Unique country name*'
              name='name'
              control={control}
              errors={errors}
              placeholder='Enter new unique country name'
              maxLength={20}
            />

            <Button name={countryId ? 'Update' : 'Create'} size='large' isLoading={isLoading} />
          </form>
        </div>
        <PreviewCard
          appearance='country'
          name={countryName}
          isActiveStatus={currentCountry ? currentCountry.isActive : false}
          count={currentCountry ? currentCountry.schoolsCount : 0}
          isCreate={!countryId}
        />
      </div>
    </div>
  );
}

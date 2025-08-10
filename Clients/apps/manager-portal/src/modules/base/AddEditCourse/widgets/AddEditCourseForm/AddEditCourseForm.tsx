import { Button, CustomCheckbox, CustomInput, CustomTextarea, Notification } from '@clients/shared';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { LanguageFieldset } from '../../../../../componets';
import { useCourseStore, useLanguageStore, useSchoolStore } from '../../../../../store';

import styles from './AddEditCourseForm.module.pcss';
import type { AddEditCourseFormProps } from './AddEditCourseForm.props.ts';
import { type AddEditCourseFormSchema, AddEditCourseFormValidationSchema } from './AddEditCourseFormSchema.ts';

export function AddEditCourseForm({ courseId = undefined }: AddEditCourseFormProps) {
  const [localError, setLocalError] = useState<string | undefined>(undefined);
  const [withAccommodation, setWithAccommodation] = useState<boolean>(false);
  const navigate = useNavigate();

  const { currentCourse, createCourse, updateCourse, isLoading, error, resetError } =
    useCourseStore(
      useShallow((state) => ({
        currentCourse: state.currentCourse,
        createCourse: state.createCourse,
        updateCourse: state.updateCourse,
        isLoading: state.isLoading,
        error: state.error,
        resetError: state.resetError
      }))
    );

  const currentSchool = useSchoolStore((state) => state.currentSchool);

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
  }, [languages, getLanguages, courseId]);

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
    if (currentCourse && courseId === currentCourse.courseId) {
      setValue('name', currentCourse.name);
      setValue('description', currentCourse.description);
      setValue('duration', currentCourse.duration);
      setValue('language', currentCourse.languageId);
      setValue('activities', currentCourse.activities);
      setValue('price', currentCourse.price);
      setValue('admissionFee', currentCourse.admissionFee);
      setWithAccommodation(currentCourse.withAccommodation);
    }
  }, [currentCourse, courseId]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<AddEditCourseFormSchema>({
    resolver: yupResolver(AddEditCourseFormValidationSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      description: '',
      activities: '',
      duration: '',
      price: '',
      admissionFee: '',
      withAccommodation: false,
      language: ''
    }
  });

  const formSubmit = async (schema: AddEditCourseFormSchema) => {
    if (!isLoading && currentSchool) {
      setLocalError(undefined);
      try {
        if (courseId && currentCourse && currentCourse.courseId === courseId) {
          await updateCourse({
            courseId: currentCourse.courseId,
            schoolId: currentSchool.schoolId,
            name: schema.name,
            description: schema.description,
            activities: schema.activities,
            duration: schema.duration,
            price: schema.price,
            admissionFee: schema.admissionFee,
            isActive: currentCourse.isActive,
            withAccommodation: withAccommodation,
            languageId: schema.language
          });
        } else if (!courseId) {
          await createCourse({
            schoolId: currentSchool.schoolId,
            languageId: schema.language,
            name: schema.name,
            description: schema.description,
            activities: schema.activities,
            duration: schema.duration,
            price: schema.price,
            admissionFee: schema.admissionFee,
            isActive: true,
            withAccommodation: withAccommodation
          });
        }
        navigate(`/programs/courses/${currentSchool.schoolId}`);
      } catch (error) {
        if (error instanceof AxiosError) {
          setLocalError(error.response?.data);
        }
      }
    }
  };

  const languageOptions = languages.map((language) => ({
    value: language.languageId,
    label: language.name
  }));

  const handleWithAccommodation = () => {
    setWithAccommodation(!withAccommodation);
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
            <div className={styles.formWrapper}>
              <div className={styles.firstBlock}>
                <CustomInput
                  name='name'
                  control={control}
                  errors={errors}
                  label='Course name*'
                  placeholder='Enter new course name'
                  maxLength={55}
                />

                <CustomInput
                  name='duration'
                  control={control}
                  errors={errors}
                  label='Duration of study*'
                  placeholder='Enter the duration'
                  maxLength={15}
                />

                <CustomCheckbox
                  checked={!withAccommodation}
                  label='With accommodation*'
                  onChange={handleWithAccommodation}
                />

                <LanguageFieldset
                  label='Course language*'
                  name='language'
                  control={control}
                  errors={errors}
                  options={languageOptions}
                  type='radio'
                />
              </div>

              <div className={styles.secondBlock}>
                <div className={styles.priceWrapper}>
                  <div className={styles.firstBlock}>
                    <CustomInput
                      name='price'
                      control={control}
                      errors={errors}
                      label='Price (€)*'
                      placeholder='Enter price'
                      maxLength={15}
                    />
                  </div>
                  <div className={styles.secondBlock}>
                    <CustomInput
                      name='admissionFee'
                      control={control}
                      errors={errors}
                      label='Admission (€)*'
                      placeholder='Enter admission fee'
                      maxLength={15}
                    />
                  </div>
                </div>

                <CustomTextarea
                  name='description'
                  control={control}
                  errors={errors}
                  label='Description*'
                  placeholder='Enter description'
                  maxSize={300}
                />

                <CustomTextarea
                  name='activities'
                  control={control}
                  errors={errors}
                  label='Activities*'
                  placeholder='Enter activities'
                  maxSize={100}
                />
              </div>
            </div>

            <div className={styles.btn}>
              <Button name={courseId ? 'Update' : 'Create'} size='large' isLoading={isLoading} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

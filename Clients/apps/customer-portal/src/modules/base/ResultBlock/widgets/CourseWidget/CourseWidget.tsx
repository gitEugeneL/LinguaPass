import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import { useCoursesStore } from '../../../../../store';
import { type Course } from '../../../../../store/course/course.models.ts';
import { ResultItem } from '../../components';

import { type CourseWidgetProps } from './CourseWidget.props.ts';

export function CourseWidget({ ...props }: CourseWidgetProps) {
  const { currentCourse, getCurrentCourse, isLoading } = useCoursesStore(
    useShallow((state) => ({
      currentCourse: state.currentCourse,
      getCurrentCourse: state.getCurrentCourse,
      isLoading: state.isLoading
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      if (props.opened && !currentCourse && props.courseId) {
        await getCurrentCourse(props.courseId);
      }
    };
    fetchData();
  }, [props.opened]);

  const getFields = () => {
    const fields: {
      title: string;
      key: keyof Course;
      formatter?: (value: string | boolean | number | undefined) => string;
    }[] = [
      { title: 'Course:', key: 'name' },
      { title: 'Language:', key: 'languageName' },
      { title: 'School:', key: 'schoolName' },
      { title: 'Location:', key: 'location' },
      {
        title: 'Accommodation:',
        key: 'withAccommodation',
        formatter: (value) => (value ? 'Yes' : 'No')
      },
      { title: 'Duration:', key: 'duration' },
      {
        title: 'Admission fee:',
        key: 'admissionFee',
        formatter: (value) => (value !== undefined ? `${value}€` : '-')
      },
      {
        title: 'Price:',
        key: 'price',
        formatter: (value) => (value !== undefined ? `${value}€` : '-')
      }
    ];
    return fields;
  };

  return (
    <>
      {getFields().map(({ title, key, formatter }) => (
        <ResultItem
          key={key}
          title={title}
          body={
            !props.courseId || !currentCourse
              ? '-'
              : formatter
                ? formatter(currentCourse[key])
                : currentCourse[key]?.toString() || '-'
          }
          isLoading={isLoading}
        />
      ))}
    </>
  );
}

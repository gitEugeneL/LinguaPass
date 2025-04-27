import ResultItem from '../../components/ResultItem/ResultItem.tsx';
import { useCoursesStore } from '../../../../../store/course/course.store.ts';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import { CourseWidgetProps } from './CourseWidget.props.ts';

export default function CourseWidget({ ...props }: CourseWidgetProps) {
  const { currentCourse, getCurrentCourse, isLoading } = useCoursesStore(
    useShallow((state) => ({
      currentCourse: state.currentCourse,
      getCurrentCourse: state.getCurrentCourse,
      isLoading: state.isLoading
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!currentCourse && props.courseId && props.opened) {
        await getCurrentCourse(props.courseId);
      }
    };
    fetchData();
  }, [props.opened]);

  return (
    <>
      <ResultItem
        title='Course:'
        body={props.courseId == null ? '-' : currentCourse?.name || '-'}
        isLoading={isLoading}
      />
      <ResultItem
        title='Language:'
        body={props.courseId == null ? '-' : currentCourse?.languageName || '-'}
        isLoading={isLoading}
      />
      <ResultItem
        title='School:'
        body={props.courseId == null ? '-' : currentCourse?.schoolName || '-'}
        isLoading={isLoading}
      />
      <ResultItem
        title='Location:'
        body={props.courseId == null ? '-' : currentCourse?.location || '-'}
        isLoading={isLoading}
      />
      <ResultItem
        title='Accommodation:'
        body={
          props.courseId == null
            ? '-'
            : currentCourse?.withAccommodation === true
              ? 'Yes'
              : currentCourse?.withAccommodation === false
                ? 'No'
                : '-'
        }
        isLoading={isLoading}
      />
      <ResultItem
        title='Duration:'
        body={props.courseId == null ? '-' : currentCourse?.duration || '-'}
        isLoading={isLoading}
      />
      <ResultItem
        title='Admission fee:'
        body={
          props.courseId == null
            ? '-'
            : currentCourse?.admissionFee != null
              ? `${currentCourse.admissionFee}€`
              : '-'
        }
        isLoading={isLoading}
      />
      <ResultItem
        title='Price:'
        body={
          props.courseId == null
            ? '-'
            : currentCourse?.price != null
              ? `${currentCourse.price}€`
              : '-'
        }
        isLoading={isLoading}
      />
    </>
  );
}

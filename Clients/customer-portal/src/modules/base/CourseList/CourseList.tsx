import style from './CourseList.module.pcss';
import CourseCard from './components/CourseCard/CourseCard.tsx';
import { useEffect } from 'react';
import { useAccountStore } from '../../../store/account/account.store.ts';
import { useCoursesStore } from '../../../store/course/course.store.ts';
import { useShallow } from 'zustand/react/shallow';
import Loader from '../../../components/base/Loader/Loader.tsx';

export default function CourseList() {
  const account = useAccountStore((state) => state.account);

  const { courses, isLoading, getCourses } = useCoursesStore(
    useShallow((state) => ({
      courses: state.courses,
      isLoading: state.isLoading,
      getCourses: state.getCourses
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      if (account?.languageId && account.schoolId) {
        await getCourses(account.schoolId, account.languageId);
      }
    };
    fetchData();
  }, []);

  const handleChoose = async () => {
    console.log('choose the course');
  };

  return (
    <>
      <ul className={style.container}>
        {isLoading && <Loader />}
        {!isLoading &&
          courses.length !== 0 &&
          courses.map((course) => (
            <CourseCard
              key={course.courseId}
              name={course.name}
              schoolName={course.schoolName}
              languageName={course.languageName}
              description={course.description}
              activities={course.activities}
              price={course.price}
              admissionFee={course.admissionFee}
              withAccommodation={course.withAccommodation}
              duration={course.duration}
              location={course.location}
            />
          ))}
      </ul>
    </>
  );
}

import style from './CourseList.module.pcss';
import CourseCard from './components/CourseCard/CourseCard.tsx';
import { useEffect } from 'react';
import { useAccountStore } from '../../../store/account/account.store.ts';
import { useCoursesStore } from '../../../store/course/course.store.ts';
import { useShallow } from 'zustand/react/shallow';
import Loader from '../../../components/base/Loader/Loader.tsx';
import { useProgressStore } from '../../../store/progress/progress.store.ts';
import { useNavigate } from 'react-router';
import { routes } from '../../../helpers/routeHelpers.ts';

export default function CourseList() {
  const navigate = useNavigate();

  const account = useAccountStore((state) => state.account);

  const { myStatus, changeStep } = useProgressStore(
    useShallow((state) => ({
      myStatus: state.myStatus,
      changeStep: state.changeStep
    }))
  );

  const { courses, isLoading, getCourses, chooseCourse } = useCoursesStore(
    useShallow((state) => ({
      courses: state.courses,
      isLoading: state.isLoading,
      getCourses: state.getCourses,
      chooseCourse: state.chooseCourse
    }))
  );

  useEffect(() => {
    const fetchData = async () => {
      if (account && account.languageId && account.schoolId) {
        await getCourses(account.schoolId, account.languageId);
      }
    };
    fetchData();
  }, [account?.languageId, account?.schoolId]);

  const handleChoose = async (courseId: string) => {
    const isOrderCorrect = myStatus && myStatus.order >= routes.course.order;
    const languageId = account?.languageId;
    const schoolId = account?.schoolId;

    if (isOrderCorrect && languageId && schoolId) {
      await chooseCourse(languageId, schoolId, courseId).then(() => {
        changeStep(routes.contact.order);
      });
      navigate(routes.contact.to);
    }
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
              courseId={course.courseId}
              handleChoose={handleChoose}
            />
          ))}
      </ul>
    </>
  );
}

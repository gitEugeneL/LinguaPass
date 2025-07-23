import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/react/shallow';

import { Loader } from '../../../components/base';
import { routes } from '../../../helpers/routeHelpers.ts';
import { useAccountStore, useCoursesStore, useProgressStore } from '../../../store';

import { CourseCard } from './components';
import style from './CourseList.module.pcss';

export function CourseList() {
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [isCardBlocked, setIsCardBlocked] = useState<boolean>(false);
  const [clickedCardId, setClickedCardId] = useState<string | null>(null);

  const navigate = useNavigate();

  const account = useAccountStore((state) => state.account);

  const { myStatus, changeStep } = useProgressStore(
    useShallow((state) => ({
      myStatus: state.myStatus,
      changeStep: state.changeStep
    }))
  );

  const { courses, currentCourse, getCourses, getCurrentCourse, chooseCourse, resetCurrentCourse } =
    useCoursesStore(
      useShallow((state) => ({
        courses: state.courses,
        currentCourse: state.currentCourse,
        getCourses: state.getCourses,
        getCurrentCourse: state.getCurrentCourse,
        chooseCourse: state.chooseCourse,
        resetCurrentCourse: state.resetCurrentCourse
      }))
    );

  const sortedCourses = useMemo(() => {
    const currentCourseId = account?.courseId;
    if (!currentCourseId) {
      return courses;
    }
    return [
      ...courses.filter((course) => course.courseId === currentCourseId),
      ...courses.filter((course) => course.courseId !== currentCourseId)
    ];
  }, [courses, account?.courseId]);

  useEffect(() => {
    const fetchData = async () => {
      if (account && account.languageId && account.schoolId) {
        setIsInitLoading(true);
        await getCourses(account.schoolId, account.languageId).then(() => {
          setIsInitLoading(false);
        });
      }
      if (myStatus && myStatus.order <= routes.course.order) {
        resetCurrentCourse();
      }
    };
    fetchData();
  }, [account?.languageId, account?.schoolId]);

  useEffect(() => {
    const fetchData = async () => {
      const isOrderCorrect = myStatus && myStatus.order > routes.course.order;
      const courseId = account?.courseId;
      if (isOrderCorrect && courseId && currentCourse === null) {
        await getCurrentCourse(courseId);
      }
    };
    fetchData();
  }, [account?.courseId]);

  const handleChoose = async (courseId: string) => {
    const isOrderCorrect = myStatus && myStatus.order >= routes.course.order;
    const languageId = account?.languageId;
    const schoolId = account?.schoolId;

    if (isOrderCorrect && languageId && schoolId && courseId !== currentCourse?.courseId) {
      setClickedCardId(courseId);
      setIsCardBlocked(true);
      await chooseCourse(languageId, schoolId, courseId).then(() => {
        changeStep(routes.contact.order);
      });
      setClickedCardId(null);
    }
    navigate(routes.contact.to);
  };

  return (
    <ul className={style.container}>
      {isInitLoading && <Loader />}

      {!isInitLoading &&
        sortedCourses.length !== 0 &&
        sortedCourses.map((course) => (
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
            isLoading={clickedCardId === course.courseId}
            isBlocked={clickedCardId !== course.courseId && isCardBlocked}
            handleChoose={handleChoose}
            {...(currentCourse && {
              chosen: currentCourse.courseId === course.courseId
            })}
          />
        ))}
    </ul>
  );
}

import style from './CourseList.module.pcss';
import CourseCard from './components/CourseCard/CourseCard.tsx';

export default function CourseList() {
  return (
    <>
      <ul className={style.container}>
        <CourseCard />
        <CourseCard />
      </ul>
    </>
  );
}

import Title from '../../../../UI/Title/Title.tsx';
import CourseList from '../../../../modules/base/CourseList/CourseList.tsx';

export default function CoursePage() {
  return (
    <>
      <Title
        subTitle='Choose your course'
        title='List of courses'
        description='There are many variations of passages of Lorem Ipsum available
but the majority have suffered alteration in some form.'
        appearance='main'
      />

      <CourseList />
    </>
  );
}

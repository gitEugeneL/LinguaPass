import { CourseList } from '../../../modules/base';
import { Title } from '../../../UI';

export function CoursePage() {
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

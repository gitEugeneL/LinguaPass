import { Title } from '@clients/shared';

import { CourseList } from '../../../modules/base';

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

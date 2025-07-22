import Title from '../../../UI/Title/Title.tsx';
import SchoolList from '../../../modules/base/SchoolList/SchoolList.tsx';

export default function SchoolPage() {
  return (
    <>
      <Title
        subTitle='Choose your course'
        title='Choose your school'
        description='There are many variations of passages of Lorem Ipsum available
but the majority have suffered alteration in some form'
        appearance='main'
      />

      <SchoolList />
    </>
  );
}

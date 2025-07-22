import LanguageList from '../../../modules/base/LanguageList/LanguageList.tsx';
import Title from '../../../UI/Title/Title.tsx';

export default function LanguagePage() {
  return (
    <>
      <Title
        subTitle='Choose your course'
        title='Choose a language to study'
        description='There are many variations of passages of Lorem Ipsum available
but the majority have suffered alteration in some form'
        appearance='main'
      />

      <LanguageList />
    </>
  );
}

import { Title } from '@clients/shared';

import { LanguageList } from '../../../modules/base';

export function LanguagePage() {
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

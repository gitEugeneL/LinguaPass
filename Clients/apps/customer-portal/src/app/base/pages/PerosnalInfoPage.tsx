import { Title } from '@clients/shared';

import { PersonalForm, ResultBlock } from '../../../modules/base';

export function PersonalInfoPage() {
  return (
    <>
      <ResultBlock type='course' />
      <ResultBlock type='contact' />
      <Title title='Your personal details' appearance='primary' />
      <PersonalForm />
    </>
  );
}

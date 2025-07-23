import { PersonalForm, ResultBlock } from '../../../modules/base';
import { Title } from '../../../UI';

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

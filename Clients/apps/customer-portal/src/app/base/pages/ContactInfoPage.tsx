import { ContactForm, ResultBlock } from '../../../modules/base';
import { Title } from '../../../UI';

export function ContactInfoPage() {
  return (
    <>
      <ResultBlock type='course' />
      <Title title='Your contact details' appearance='primary' />
      <ContactForm />
    </>
  );
}

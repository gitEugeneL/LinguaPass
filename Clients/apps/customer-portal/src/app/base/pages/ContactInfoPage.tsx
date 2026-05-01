import { Title } from '@clients/shared';

import { ContactForm, ResultBlock } from '../../../modules/base';

export function ContactInfoPage() {
  return (
    <>
      <ResultBlock type='course' />
      <Title title='Your contact details' appearance='primary' />
      <ContactForm />
    </>
  );
}

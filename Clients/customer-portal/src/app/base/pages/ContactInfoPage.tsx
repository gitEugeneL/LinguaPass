import Title from '../../../UI/Title/Title.tsx';
import ContactForm from '../../../modules/base/ContactForm/ContactForm.tsx';
import ResultBlock from '../../../modules/base/ResultBlock/ResultBlock.tsx';

export default function ContactInfoPage() {
  return (
    <>
      <ResultBlock type='course' />
      <Title title='Your contact details' appearance='primary' />
      <ContactForm />
    </>
  );
}

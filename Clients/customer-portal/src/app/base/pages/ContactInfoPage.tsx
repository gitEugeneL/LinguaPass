import Title from '../../../UI/Title/Title.tsx';
import ContactForm from '../../../modules/base/ContactForm/ContactForm.tsx';

export default function ContactInfoPage() {
  return (
    <>
      <Title title='Your contact details' appearance='primary' />
      <ContactForm />
    </>
  );
}

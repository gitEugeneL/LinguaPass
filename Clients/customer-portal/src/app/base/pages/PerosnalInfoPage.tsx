import Title from '../../../UI/Title/Title.tsx';
import PersonalForm from '../../../modules/base/PersonalForm/PersonalForm.tsx';

export default function PersonalInfoPage() {
  return (
    <>
      <Title title='Your personal details' appearance='primary' />
      <PersonalForm />
    </>
  );
}

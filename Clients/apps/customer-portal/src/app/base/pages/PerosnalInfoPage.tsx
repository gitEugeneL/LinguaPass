import Title from '../../../UI/Title/Title.tsx';
import PersonalForm from '../../../modules/base/PersonalForm/PersonalForm.tsx';
import ResultBlock from '../../../modules/base/ResultBlock/ResultBlock.tsx';

export default function PersonalInfoPage() {
  return (
    <>
      <ResultBlock type='course' />
      <ResultBlock type='contact' />
      <Title title='Your personal details' appearance='primary' />
      <PersonalForm />
    </>
  );
}

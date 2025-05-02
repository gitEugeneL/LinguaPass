import ResultBlock from '../../../modules/base/ResultBlock/ResultBlock.tsx';
import Title from '../../../UI/Title/Title.tsx';

export default function DocumentsPage() {
  return (
    <>
      <ResultBlock type='course' />
      <ResultBlock type='contact' />
      <ResultBlock type='personal' />
      <Title title='Your documents' appearance='primary' />
    </>
  );
}

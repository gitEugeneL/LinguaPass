import ResultBlock from '../ResultBlock/ResultBlock.tsx';

export default function HomeList() {
  return (
    <>
      <ResultBlock type='course' />
      <ResultBlock type='contact' />
      <ResultBlock type='personal' />
      <ResultBlock type='documents' />
    </>
  );
}

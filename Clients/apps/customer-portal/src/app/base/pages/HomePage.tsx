import { ConfirmBlock, ResultBlock } from '../../../modules/base';

export function HomePage() {
  return (
    <>
      <ResultBlock type='course' />
      <ResultBlock type='contact' />
      <ResultBlock type='personal' />
      <ResultBlock type='documents' />
      <ConfirmBlock />
    </>
  );
}

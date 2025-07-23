import { ConfirmBlock, FileUploader, ResultBlock } from '../../../modules/base';

export function DocumentsPage() {
  return (
    <>
      <ResultBlock type='course' />
      <ResultBlock type='contact' />
      <ResultBlock type='personal' />
      <FileUploader />
      <ConfirmBlock />
    </>
  );
}

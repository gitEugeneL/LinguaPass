import ResultBlock from '../../../modules/base/ResultBlock/ResultBlock.tsx';
import FileUploader from '../../../modules/base/FileUploader/FileUploader.tsx';

export default function DocumentsPage() {
  return (
    <>
      <ResultBlock type='course' />
      <ResultBlock type='contact' />
      <ResultBlock type='personal' />
      <FileUploader />
    </>
  );
}

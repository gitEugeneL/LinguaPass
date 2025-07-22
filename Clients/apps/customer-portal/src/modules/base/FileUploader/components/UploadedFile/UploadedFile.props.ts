export interface UploadedFileProps {
  name: string;
  index: number;
  isLoading: boolean;
  deleteFile: (fileName: string) => void;
}

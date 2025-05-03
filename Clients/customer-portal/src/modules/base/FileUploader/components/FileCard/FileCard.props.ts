export interface FileCardProps {
  index: number;
  name: string;
  size: number;
  removeFile: () => void;
  uploadFile: () => void;
  cancelUpload: () => void;
  isLoading: boolean;
  progress: number;
  uploadingFileIndex: number | null;
}

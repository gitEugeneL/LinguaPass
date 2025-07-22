import { type ChangeEvent } from 'react';

export interface FileInputProps {
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  isLoading: boolean;
}

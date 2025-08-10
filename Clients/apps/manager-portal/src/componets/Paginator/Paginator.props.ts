export interface PaginatorProps {
  pageNumber: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

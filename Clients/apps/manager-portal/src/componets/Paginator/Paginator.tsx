import { ArrowIcon } from '@clients/shared';
import cn from 'classnames';

import styles from './Paginator.module.pcss';
import type { PaginatorProps } from './Paginator.props.ts';

export function Paginator({ pageNumber, totalPages, onPageChange }: PaginatorProps) {
  const getPageNumbers = () => {
    const maxPagesToShow = 3;
    const pages: (number | string)[] = [];

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const sidePages = 1;
    let startPage = Math.max(1, pageNumber - sidePages);
    let endPage = Math.min(totalPages, pageNumber + sidePages);

    if (pageNumber <= sidePages) {
      endPage = Math.min(maxPagesToShow, totalPages);
    }
    if (pageNumber > totalPages - sidePages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('..');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('..');
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePrev = () => {
    if (pageNumber > 1) {
      onPageChange(pageNumber - 1);
    }
  };

  const handleNext = () => {
    if (pageNumber < totalPages) {
      onPageChange(pageNumber + 1);
    }
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <div className={styles.paginator}>
      <button
        className={cn(styles.leftBtn, { [styles.disabled]: pageNumber === 1 })}
        onClick={handlePrev}
        disabled={pageNumber === 1}
      >
        <ArrowIcon />
      </button>

      {getPageNumbers().map((page, index) => (
        <div
          key={index}
          className={cn(styles.number, {
            [styles.activeNumber]: page === pageNumber,
            [styles.ellipsis]: typeof page === 'string'
          })}
          onClick={() => handlePageClick(page)}
        >
          {page}
        </div>
      ))}

      <button
        className={cn(styles.rightBtn, { [styles.disabled]: pageNumber === totalPages })}
        onClick={handleNext}
        disabled={pageNumber === totalPages}
      >
        <ArrowIcon />
      </button>
    </div>
  );
}

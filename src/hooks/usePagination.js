import { useState, useCallback } from 'react';

export const usePagination = (initialLimit = 5) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);

  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    limit,
    goToPage,
    nextPage,
    prevPage,
    resetPage,
    setLimit
  };
};
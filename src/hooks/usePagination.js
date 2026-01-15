import { useState, useCallback } from 'react';

// Custom hook for server-side pagination
// Manages page state and provides navigation helpers
export const usePagination = (initialLimit = 5) => {
  // Track current page number (starts at 1)
  const [currentPage, setCurrentPage] = useState(1);
  // Items per page (default: 5)
  const [limit, setLimit] = useState(initialLimit);

  // Navigate to specific page
  const goToPage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Go to next page
  const nextPage = useCallback(() => {
    setCurrentPage(prev => prev + 1);
  }, []);

  // Go to previous page
  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  // Reset to first page (useful after search/filter changes)
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
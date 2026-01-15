import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

// Reusable Pagination Component
// Displays page controls and info about current page/total records
const Pagination = ({ currentPage, totalRecords, limit, onPageChange }) => {
  // Ensure we have valid values
  const validCurrentPage = Math.max(1, currentPage || 1);
  const validTotalRecords = Math.max(0, totalRecords || 0);
  const validLimit = Math.max(1, limit || 5);
  
  // Calculate total pages based on records and limit
  const totalPages = Math.ceil(validTotalRecords / validLimit);
  
  // Don't render if no records or only one page
  if (validTotalRecords === 0 || totalPages <= 1) {
    return null;
  }
  
  // Check if we're on first or last page to disable buttons
  const isFirstPage = validCurrentPage === 1;
  const isLastPage = validCurrentPage >= totalPages;

  // Calculate range of records shown on current page
  const startRecord = (validCurrentPage - 1) * validLimit + 1;
  const endRecord = Math.min(validCurrentPage * validLimit, validTotalRecords);

  // Generate array of page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show max 5 page buttons
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Show current page with 2 pages on each side
      let start = Math.max(1, validCurrentPage - 2);
      let end = Math.min(totalPages, validCurrentPage + 2);
      
      // Adjust if near start or end
      if (validCurrentPage <= 3) end = maxVisible;
      if (validCurrentPage >= totalPages - 2) start = totalPages - maxVisible + 1;
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      {/* Display current page info and total records */}
      <div className="pagination-info">
        Showing {startRecord} to {endRecord} of {validTotalRecords} records
      </div>

      {/* Pagination controls */}
      <div className="pagination-controls">
        <ButtonGroup>
          {/* Previous button - disabled on first page */}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onPageChange(validCurrentPage - 1)}
            disabled={isFirstPage}
          >
            <MdChevronLeft /> Previous
          </Button>

          {/* Page number buttons */}
          {getPageNumbers().map(page => (
            <Button
              key={page}
              variant={page === validCurrentPage ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => onPageChange(page)}
            >
              {page}
            </Button>
          ))}

          {/* Next button - disabled on last page */}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onPageChange(validCurrentPage + 1)}
            disabled={isLastPage}
          >
            Next <MdChevronRight />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default Pagination;

import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const Pagination = ({ currentPage, totalRecords, limit, onPageChange }) => {
  const validCurrentPage = Math.max(1, currentPage || 1);
  const validTotalRecords = Math.max(0, totalRecords || 0);
  const validLimit = Math.max(1, limit || 5);
  
  const totalPages = Math.ceil(validTotalRecords / validLimit);
  
  if (validTotalRecords === 0 || totalPages <= 1) {
    return null;
  }
  
  const isFirstPage = validCurrentPage === 1;
  const isLastPage = validCurrentPage >= totalPages;

  const startRecord = (validCurrentPage - 1) * validLimit + 1;
  const endRecord = Math.min(validCurrentPage * validLimit, validTotalRecords);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, validCurrentPage - 2);
      let end = Math.min(totalPages, validCurrentPage + 2);
      if (validCurrentPage <= 3) end = maxVisible;
      if (validCurrentPage >= totalPages - 2) start = totalPages - maxVisible + 1;
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {startRecord} to {endRecord} of {validTotalRecords} records (Limit: {validLimit})
      </div>
      <div className="pagination-controls">
        <ButtonGroup>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onPageChange(validCurrentPage - 1)}
            disabled={isFirstPage}
          >
            <MdChevronLeft /> Previous
          </Button>

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

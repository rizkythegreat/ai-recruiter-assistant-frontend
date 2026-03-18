import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  className = ''
}: PaginationProps) {
  //   if (totalPages <= 1) return null;

  const startIndex = itemsPerPage && totalItems ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endIndex =
    itemsPerPage && totalItems ? Math.min(totalItems, currentPage * itemsPerPage) : null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Item Count Info */}
      {startIndex && endIndex && totalItems && (
        <span className="text-xs text-base-content/50">
          Showing {startIndex} to {endIndex} of {totalItems} items
        </span>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <button
          className="btn btn-xs btn-ghost"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>

        {/* Page Numbers */}
        <div className="join">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`join-item btn btn-xs ${currentPage === i + 1 ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => onPageChange(i + 1)}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          className="btn btn-xs btn-ghost"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}>
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

'use client';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function buildPageRange(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
    result.push(sorted[i]);
  }

  return result;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = buildPageRange(currentPage, totalPages);
  const btnBase ='flex items-center justify-center size-10 rounded-lg border text-sm font-semibold transition-all';
  const activeBtn = `${btnBase} border-primary bg-primary text-white`;
  const inactiveBtn = `${btnBase} border-gray-200 bg-white text-gray-500 hover:text-primary hover:border-primary`;
  const disabledBtn = `${btnBase} border-gray-100 bg-white text-gray-300 cursor-not-allowed`;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 mt-12 mb-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={currentPage === 1 ? disabledBtn : inactiveBtn}
        aria-label="Previous page"
      >
        <ChevronLeftIcon fontSize="small" />
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={page === currentPage ? activeBtn : inactiveBtn}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={currentPage === totalPages ? disabledBtn : inactiveBtn}
        aria-label="Next page"
      >
        <ChevronRightIcon fontSize="small" />
      </button>
    </nav>
  );
}

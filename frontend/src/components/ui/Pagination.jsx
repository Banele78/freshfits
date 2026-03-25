import React, { useEffect, useMemo } from "react";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 1,
  scrollOnChange = true,
}) {
  if (totalPages <= 1) return null;

  // Optional scroll behavior
  useEffect(() => {
    if (scrollOnChange) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentPage, scrollOnChange]);

  // Memoize page calculation
  const visiblePages = useMemo(() => {
    const pages = [];

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(currentPage - half, 0);
    let end = Math.min(start + maxVisible, totalPages);

    if (end - start < maxVisible) {
      start = Math.max(end - maxVisible, 0);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  }, [currentPage, totalPages, maxVisible]);

  const baseBtn =
    "min-w-[38px] h-9 px-3 text-sm font-medium rounded-md border transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-black/20 disabled:cursor-not-allowed disabled:opacity-40";

  const handleChange = (page) => {
    if (page >= 0 && page < totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <nav
      className="flex justify-center mt-10 gap-2 flex-wrap bg-neutral-50 p-3 rounded-lg"
      aria-label="Pagination"
    >
      {/* Prev */}
      <button
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`${baseBtn} bg-white border-neutral-200 text-neutral-700 hover:border-black hover:text-black hover:-translate-y-[1px]`}
        aria-label="Previous page"
      >
        Prev
      </button>

      {/* First + Ellipsis */}
      {visiblePages[0] > 0 && (
        <>
          <button
            onClick={() => handleChange(0)}
            className={`${baseBtn} bg-white border-neutral-200 text-neutral-700 hover:border-black hover:text-black hover:-translate-y-[1px]`}
          >
            1
          </button>
          {visiblePages[0] > 1 && (
            <span className="px-2 select-none text-neutral-400">…</span>
          )}
        </>
      )}

      {/* Page Numbers */}
      {visiblePages.map((page) => (
        <button
          key={page}
          onClick={() => handleChange(page)}
          aria-current={currentPage === page ? "page" : undefined}
          className={`${baseBtn} ${
            currentPage === page
              ? "bg-black text-white border-black shadow-sm"
              : "bg-white border-neutral-200 text-neutral-700 hover:border-black hover:text-black hover:-translate-y-[1px]"
          }`}
        >
          {page + 1}
        </button>
      ))}

      {/* Last + Ellipsis */}
      {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
        <>
          {visiblePages[visiblePages.length - 1] < totalPages - 2 && (
            <span className="px-2 select-none text-neutral-400">…</span>
          )}
          <button
            onClick={() => handleChange(totalPages - 1)}
            className={`${baseBtn} bg-white border-neutral-200 text-neutral-700 hover:border-black hover:text-black hover:-translate-y-[1px]`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className={`${baseBtn} bg-white border-neutral-200 text-neutral-700 hover:border-black hover:text-black hover:-translate-y-[1px]`}
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}

// src/components/pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Göstəriləcək səhifə nömrələrini hesablayırıq
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 3; // Bir dəfədə göstəriləcək maksimum səhifə sayı

    if (totalPages <= maxPagesToShow) {
      // Əgər ümumi səhifə sayı az isə, hamısını göstər
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Əgər çox səhifə varsa, cari səhifənin ətrafında bir neçəsini göstər
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
        }`}
      >
        Əvvəlki
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`px-3 py-1 rounded ${
            page === currentPage
              ? "bg-indigo-600 text-white"
              : page === "..."
              ? "bg-white text-gray-500 cursor-default"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
        }`}
      >
        Sonrakı
      </button>
    </div>
  );
};

export default Pagination;

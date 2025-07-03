import React from 'react';
import { Pagination as BSPagination } from 'react-bootstrap';

const Pagination = ({ productsPerPage, totalProducts, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="mt-4">
      <BSPagination className="justify-content-center">
        <BSPagination.Prev
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {/* Solo mostrar un subconjunto de páginas si hay muchas */}
        {pageNumbers.map((number) => (
          <BSPagination.Item
            key={number}
            onClick={() => paginate(number)}
            active={number === currentPage}
          >
            {number}
          </BSPagination.Item>
        ))}

        <BSPagination.Next
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0} // Deshabilitar si no hay páginas o si es la última
        />
      </BSPagination>
    </nav>
  );
};

export default Pagination;
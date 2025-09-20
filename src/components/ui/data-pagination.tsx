import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
}

export interface DataPaginationProps {
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  itemName?: string;
  className?: string;
}

export const DataPagination: React.FC<DataPaginationProps> = ({
  pagination,
  currentPage,
  onPageChange,
  showInfo = true,
  itemName = 'itens',
  className = '',
}) => {
  // Não renderizar se houver apenas uma página
  if (pagination.last_page <= 1) {
    return null;
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < pagination.last_page) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Gerar números das páginas para exibir
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    const totalPages = pagination.last_page;

    // Se há 5 páginas ou menos, mostrar todas
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Lógica para páginas com reticências
    if (currentPage <= 3) {
      // Início: 1, 2, 3, 4, ..., última
      for (let i = 1; i <= 4; i++) {
        pages.push(i);
      }
      if (totalPages > 5) {
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    } else if (currentPage >= totalPages - 2) {
      // Final: 1, ..., antepenúltima, penúltima, última
      pages.push(1);
      if (totalPages > 5) {
        pages.push('ellipsis');
      }
      for (let i = totalPages - 3; i <= totalPages; i++) {
        if (i > 1) pages.push(i);
      }
    } else {
      // Meio: 1, ..., atual-1, atual, atual+1, ..., última
      pages.push(1);
      pages.push('ellipsis');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i);
      }
      pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className={`flex items-center justify-between pt-6 border-t border-border ${className}`}>
      {showInfo && (
        <div className="text-sm text-muted-foreground">
          Mostrando {pagination.from || ((currentPage - 1) * pagination.per_page + 1)} a{' '}
          {pagination.to || Math.min(currentPage * pagination.per_page, pagination.total)} de{' '}
          {pagination.total} {itemName}
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePreviousPage();
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageClick(page as number);
                  }}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNextPage();
              }}
              className={currentPage === pagination.last_page ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default DataPagination;
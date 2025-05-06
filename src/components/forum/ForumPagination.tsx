
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface ForumPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ForumPagination: React.FC<ForumPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Ne pas afficher de pagination s'il n'y a qu'une seule page
  if (totalPages <= 1) {
    return null;
  }

  // Calculer les pages à afficher
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    // Toujours afficher la première page
    pages.push(1);
    
    // Ajouter des points de suspension si nécessaire
    if (currentPage > 3) {
      pages.push('ellipsis');
    }
    
    // Ajouter les pages autour de la page actuelle
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }
    
    // Ajouter des points de suspension si nécessaire
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }
    
    // Toujours afficher la dernière page si elle existe
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      {getPageNumbers().map((page, i) => 
        page === 'ellipsis' ? (
          <Button
            key={`ellipsis-${i}`}
            variant="outline"
            size="icon"
            disabled
            className="cursor-default"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={currentPage === page ? "bg-babybaby-cosmic hover:bg-babybaby-cosmic/90" : ""}
          >
            {page}
          </Button>
        )
      )}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ForumPagination;

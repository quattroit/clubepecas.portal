"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  /** Preparado para integração futura — não utilizado nesta sprint */
  onPageChange?: (page: number) => void;
  className?: string;
};

/**
 * Paginação visual — estrutura pronta para dados reais.
 */
function Pagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Paginação"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Página anterior"
        disabled={currentPage <= 1}
        onClick={() => onPageChange?.(currentPage - 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((page) => {
        const isActive = page === currentPage;

        return (
          <Button
            key={page}
            type="button"
            variant={isActive ? "primary" : "outline"}
            size="icon-sm"
            aria-label={`Página ${page}`}
            aria-current={isActive ? "page" : undefined}
            onClick={() => onPageChange?.(page)}
          >
            {page}
          </Button>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        aria-label="Próxima página"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}

export { Pagination };
export type { PaginationProps };

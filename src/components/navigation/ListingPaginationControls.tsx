"use client";

import { Pagination } from "@/components/navigation/Pagination";
import { cn } from "@/lib/utils";
import {
  parsePublicListingPageSize,
  PUBLIC_LISTING_DEFAULT_PAGE_SIZE,
  PUBLIC_LISTING_PAGE_SIZE_OPTIONS,
} from "@/utils/public-listing-pagination";

type ListingPaginationControlsProps = {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeSelectId: string;
  className?: string;
};

const selectClassName =
  "border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 h-8 rounded-lg border px-2.5 text-sm outline-none focus-visible:ring-3";

/**
 * Seletor de itens por página + paginação para listagens públicas.
 */
function ListingPaginationControls({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeSelectId,
  className,
}: ListingPaginationControlsProps) {
  const showPagination =
    totalPages > 1 || pageSize >= PUBLIC_LISTING_DEFAULT_PAGE_SIZE;

  if (!showPagination) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <label
          htmlFor={pageSizeSelectId}
          className="text-small text-muted-foreground whitespace-nowrap"
        >
          Itens por página
        </label>
        <select
          id={pageSizeSelectId}
          className={cn(selectClassName, "w-auto")}
          value={pageSize}
          onChange={(event) => {
            onPageSizeChange(parsePublicListingPageSize(event.target.value));
          }}
        >
          {PUBLIC_LISTING_PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {totalPages > 1 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      ) : null}
    </div>
  );
}

export { ListingPaginationControls };

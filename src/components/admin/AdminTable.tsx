"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Inbox } from "lucide-react";

import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { AdminTableSkeleton } from "@/components/admin/skeletons/AdminTableSkeleton";
import { cn } from "@/lib/utils";

type AdminTableSortDirection = "asc" | "desc";

type AdminTableColumn<T> = {
  id: string;
  header: string;
  /** Célula customizada; se omitida, usa `accessor`. */
  cell?: (row: T) => ReactNode;
  accessor?: (row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
};

type AdminTableProps<T> = {
  columns: AdminTableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string | number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  /** Ações por linha (coluna final). */
  rowActions?: (row: T) => ReactNode;
  sortColumnId?: string | null;
  sortDirection?: AdminTableSortDirection;
  onSortChange?: (columnId: string) => void;
  /** Slot de paginação (estrutura pronta — lógica nas features). */
  pagination?: ReactNode;
  className?: string;
  /** Preparado para seleção futura — não implementa checkbox nesta sprint. */
  selectable?: boolean;
  caption?: string;
};

function SortIcon({
  active,
  direction,
}: {
  active: boolean;
  direction?: AdminTableSortDirection;
}) {
  if (!active) {
    return <ArrowUpDown className="size-3.5 opacity-40" aria-hidden />;
  }
  return direction === "desc" ? (
    <ArrowDown className="size-3.5" aria-hidden />
  ) : (
    <ArrowUp className="size-3.5" aria-hidden />
  );
}

/**
 * Tabela administrativa genérica — paginação/ordenação via props.
 */
function AdminTable<T>({
  columns,
  data,
  getRowId,
  loading = false,
  emptyTitle = "Nenhum resultado",
  emptyDescription = "Não há itens para exibir no momento.",
  emptyAction,
  rowActions,
  sortColumnId,
  sortDirection,
  onSortChange,
  pagination,
  className,
  selectable = false,
  caption,
}: AdminTableProps<T>) {
  if (loading) {
    return <AdminTableSkeleton columns={columns.length + (rowActions ? 1 : 0)} />;
  }

  if (data.length === 0) {
    return (
      <AdminEmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={<Inbox aria-hidden />}
        action={emptyAction}
      />
    );
  }

  return (
    <div
      data-slot="admin-table"
      data-selectable={selectable || undefined}
      className={cn(
        "border-border bg-card overflow-hidden rounded-xl border shadow-xs",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          {caption ? <caption className="sr-only">{caption}</caption> : null}
          <thead className="bg-muted/40 border-border border-b">
            <tr>
              {columns.map((column) => {
                const isSorted = sortColumnId === column.id;
                const canSort = Boolean(column.sortable && onSortChange);

                return (
                  <th
                    key={column.id}
                    scope="col"
                    className={cn(
                      "text-muted-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase",
                      column.headerClassName,
                    )}
                    aria-sort={
                      isSorted
                        ? sortDirection === "desc"
                          ? "descending"
                          : "ascending"
                        : canSort
                          ? "none"
                          : undefined
                    }
                  >
                    {canSort ? (
                      <button
                        type="button"
                        className="focus-visible:ring-ring inline-flex items-center gap-1.5 rounded-md outline-none focus-visible:ring-2"
                        onClick={() => onSortChange?.(column.id)}
                      >
                        {column.header}
                        <SortIcon active={isSorted} direction={sortDirection} />
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
              {rowActions ? (
                <th
                  scope="col"
                  className="text-muted-foreground px-4 py-3 text-right text-xs font-semibold tracking-wide uppercase"
                >
                  Ações
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {data.map((row) => (
              <tr
                key={String(getRowId(row))}
                className="hover:bg-muted/30 transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn("text-foreground px-4 py-3", column.className)}
                  >
                    {column.cell
                      ? column.cell(row)
                      : column.accessor
                        ? column.accessor(row)
                        : null}
                  </td>
                ))}
                {rowActions ? (
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center justify-end gap-1">
                      {rowActions(row)}
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination ? (
        <div
          data-slot="admin-table-pagination"
          className="border-border bg-muted/20 flex items-center justify-between gap-3 border-t px-4 py-3"
        >
          {pagination}
        </div>
      ) : null}
    </div>
  );
}

export { AdminTable };
export type {
  AdminTableProps,
  AdminTableColumn,
  AdminTableSortDirection,
};

export const QUOTATION_PAGE_SIZE_OPTIONS = [10, 20, 30] as const;

export const QUOTATION_DEFAULT_PAGE_SIZE = 10;

export type QuotationPageSize = (typeof QUOTATION_PAGE_SIZE_OPTIONS)[number];

export function parseQuotationPageSize(raw: string | null): QuotationPageSize {
  const value = Number(raw);
  if (
    (QUOTATION_PAGE_SIZE_OPTIONS as readonly number[]).includes(value)
  ) {
    return value as QuotationPageSize;
  }
  return QUOTATION_DEFAULT_PAGE_SIZE;
}

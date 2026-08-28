export const PUBLIC_LISTING_PAGE_SIZE_OPTIONS = [10, 20, 30] as const;

export const PUBLIC_LISTING_DEFAULT_PAGE_SIZE = 10;

export type PublicListingPageSize =
  (typeof PUBLIC_LISTING_PAGE_SIZE_OPTIONS)[number];

export function parsePublicListingPageSize(
  raw: string | null | undefined,
): PublicListingPageSize {
  const value = Number(raw);
  if (
    (PUBLIC_LISTING_PAGE_SIZE_OPTIONS as readonly number[]).includes(value)
  ) {
    return value as PublicListingPageSize;
  }
  return PUBLIC_LISTING_DEFAULT_PAGE_SIZE;
}

export function createListingShuffleSeed(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

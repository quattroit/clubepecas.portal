export const PUBLIC_LISTING_PAGE_SIZE_OPTIONS = [12, 24, 36] as const;

export const PUBLIC_LISTING_DEFAULT_PAGE_SIZE = 12;

export const PUBLIC_LISTING_MAX_PAGE_SIZE =
  PUBLIC_LISTING_PAGE_SIZE_OPTIONS[PUBLIC_LISTING_PAGE_SIZE_OPTIONS.length - 1];

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

/**
 * Chaves centralizadas do TanStack Query (marketplace, auth, dashboard).
 */
export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: ["auth", "me"] as const,
  },
  advertisements: {
    all: ["advertisements"] as const,
    me: ["advertisements", "me"] as const,
    detail: (id: string) => ["advertisements", "detail", id] as const,
    bySlug: (slug: string) => ["advertisements", "slug", slug] as const,
    photos: (advertisementId: string) =>
      ["advertisements", advertisementId, "photos"] as const,
  },
  marketplace: {
    all: ["marketplace"] as const,
    list: (filters?: {
      title?: string;
      category?: number;
      city?: string;
      state?: string;
      page?: number;
    }) => ["marketplace", "list", filters ?? {}] as const,
    detail: (slug: string) => ["marketplace", "detail", slug] as const,
    stores: ["marketplace", "stores"] as const,
    store: (slug: string) => ["marketplace", "store", slug] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  sellers: {
    all: ["sellers"] as const,
    bySlug: (slug: string) => ["sellers", "slug", slug] as const,
  },
  seller: {
    me: ["seller", "me"] as const,
  },
} as const;

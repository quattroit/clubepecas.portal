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
    detail: (id: number) => ["advertisements", "detail", id] as const,
    bySlug: (slug: string) => ["advertisements", "slug", slug] as const,
    photos: (advertisementId: number) =>
      ["advertisements", advertisementId, "photos"] as const,
  },
  marketplace: {
    all: ["marketplace"] as const,
    list: (filters?: {
      q?: string;
      title?: string;
      categoryId?: number;
      categorySlug?: string;
      vehicleBrandId?: number;
      vehicleBrandSlug?: string;
      brand?: string;
      vehicleModelId?: number;
      vehicleModelSlug?: string;
      model?: string;
      manufacturingYear?: number;
      modelYear?: number;
      city?: string;
      state?: string;
      priceMin?: number;
      priceMax?: number;
      newOnly?: boolean;
      sort?: string;
      page?: number;
    }) => ["marketplace", "list", filters ?? {}] as const,
    detail: (slug: string) => ["marketplace", "detail", slug] as const,
    stores: ["marketplace", "stores"] as const,
    store: (slug: string) => ["marketplace", "store", slug] as const,
  },
  categories: {
    all: ["categories"] as const,
  },
  cities: {
    all: ["cities"] as const,
  },
  vehicleBrands: {
    all: ["vehicleBrands"] as const,
  },
  vehicleModels: {
    all: ["vehicleModels"] as const,
    list: (params: Record<string, unknown>) =>
      ["vehicleModels", "list", params] as const,
  },
  home: {
    all: ["home"] as const,
    stats: ["home", "stats"] as const,
  },
  platformSettings: ["platform-settings"] as const,
  sellers: {
    all: ["sellers"] as const,
    bySlug: (slug: string) => ["sellers", "slug", slug] as const,
  },
  seller: {
    all: ["seller"] as const,
    me: ["seller", "me"] as const,
    metrics: (period: string) => ["seller", "metrics", period] as const,
    subscription: ["seller", "subscription"] as const,
    subscriptions: ["seller", "subscriptions"] as const,
  },
  subscriptionPlans: {
    all: ["subscriptionPlans"] as const,
  },
  admin: {
    all: ["admin"] as const,
    dashboard: (period: string) => ["admin", "dashboard", period] as const,
    analytics: (period: string) => ["admin", "analytics", period] as const,
    sellers: {
      all: ["admin", "sellers"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "sellers", "list", params] as const,
      detail: (id: number, period: string) =>
        ["admin", "sellers", "detail", id, period] as const,
    },
    advertisements: {
      all: ["admin", "advertisements"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "advertisements", "list", params] as const,
      detail: (id: number, period: string) =>
        ["admin", "advertisements", "detail", id, period] as const,
    },
    categories: {
      all: ["admin", "categories"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "categories", "list", params] as const,
    },
    cities: {
      all: ["admin", "cities"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "cities", "list", params] as const,
    },
    vehicleBrands: {
      all: ["admin", "vehicleBrands"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "vehicleBrands", "list", params] as const,
    },
    vehicleModels: {
      all: ["admin", "vehicleModels"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "vehicleModels", "list", params] as const,
    },
    subscriptionPlans: {
      all: ["admin", "subscriptionPlans"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "subscriptionPlans", "list", params] as const,
      detail: (id: number) =>
        ["admin", "subscriptionPlans", "detail", id] as const,
    },
    audit: {
      all: ["admin", "audit"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "audit", "list", params] as const,
    },
    files: {
      integrity: ["admin", "files", "integrity"] as const,
    },
    settings: ["admin", "settings"] as const,
  },
} as const;

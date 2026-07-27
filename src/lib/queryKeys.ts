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
    subscriptionPayments: ["seller", "subscription", "payments"] as const,
    subscriptionHistory: ["seller", "subscription", "history"] as const,
    payments: ["seller", "payments"] as const,
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
    representatives: {
      all: ["admin", "representatives"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "representatives", "list", params] as const,
      detail: (id: number) =>
        ["admin", "representatives", "detail", id] as const,
    },
    professionalBuyers: {
      all: ["admin", "professionalBuyers"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "professionalBuyers", "list", params] as const,
      detail: (id: number) =>
        ["admin", "professionalBuyers", "detail", id] as const,
    },

    commissions: {
      all: ["admin", "commissions"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "commissions", "list", params] as const,
      detail: (id: number) => ["admin", "commissions", "detail", id] as const,
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
    payments: {
      all: ["admin", "payments"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "payments", "list", params] as const,
    },
    payouts: {
      all: ["admin", "payouts"] as const,
      list: (params: Record<string, unknown>) =>
        ["admin", "payouts", "list", params] as const,
      detail: (id: number) => ["admin", "payouts", "detail", id] as const,
    },
    financial: {
      dashboard: ["admin", "financial", "dashboard"] as const,
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
  professionalBuyers: {
    all: ["professionalBuyers"] as const,
    me: ["professionalBuyers", "me"] as const,
  },
  partRequests: {
    all: ["partRequests"] as const,
    me: (params: Record<string, unknown>) =>
      ["partRequests", "me", params] as const,
    detail: (id: number) => ["partRequests", "detail", id] as const,
    suppliers: (id: number) => ["partRequests", "suppliers", id] as const,
  },
  representative: {
    all: ["representative"] as const,
    me: ["representative", "me"] as const,
    dashboard: ["representative", "dashboard"] as const,
    sellers: {
      list: (params: Record<string, unknown>) =>
        ["representative", "sellers", "list", params] as const,
      detail: (id: number) => ["representative", "sellers", "detail", id] as const,
    },
    commissions: {
      list: (params: Record<string, unknown>) =>
        ["representative", "commissions", "list", params] as const,
      detail: (id: number) =>
        ["representative", "commissions", "detail", id] as const,
    },
    statement: ["representative", "statement"] as const,
    referralLink: ["representative", "referralLink"] as const,
    payouts: {
      all: ["representative", "payouts"] as const,
      list: (params: Record<string, unknown>) =>
        ["representative", "payouts", "list", params] as const,
      detail: (id: number) =>
        ["representative", "payouts", "detail", id] as const,
    },
  },
} as const;

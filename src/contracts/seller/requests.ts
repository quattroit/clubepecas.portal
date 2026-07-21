export type CreateSellerRequest = {
  storeName: string;
  displayName: string;
  cityId: number;
  personType: number;
  document: string;
  description?: string | null;
  whatsApp: string;
  instagram?: string | null;
  photoUrl?: string | null;
};

export type UpdateSellerRequest = {
  storeName: string;
  displayName: string;
  cityId: number;
  personType: number;
  document: string;
  description?: string | null;
  whatsApp: string;
  instagram?: string | null;
  photoUrl?: string | null;
};

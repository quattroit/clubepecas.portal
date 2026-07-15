export type CreateSellerRequest = {
  storeName: string;
  displayName: string;
  city: string;
  state: string;
  description?: string | null;
  whatsApp?: string | null;
  photoUrl?: string | null;
};

export type UpdateSellerRequest = {
  storeName: string;
  displayName: string;
  city: string;
  state: string;
  description?: string | null;
  whatsApp?: string | null;
  photoUrl?: string | null;
};

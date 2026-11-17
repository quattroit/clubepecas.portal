export type CreateSellerRequest = {
  storeName: string;
  cityId: number;
  personType: number;
  document: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  description?: string | null;
  complement?: string | null;
  whatsApp: string;
  instagram?: string | null;
  photoUrl?: string | null;
  /** Quando true, endereço completo é exibido publicamente e retirada na loja fica disponível. */
  showAddress: boolean;
  specialtyIds?: number[];
};

export type UpdateSellerRequest = {
  storeName: string;
  cityId: number;
  personType: number;
  document: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  description?: string | null;
  complement?: string | null;
  whatsApp: string;
  instagram?: string | null;
  photoUrl?: string | null;
  /** Quando true, endereço completo é exibido publicamente e retirada na loja fica disponível. */
  showAddress: boolean;
  specialtyIds?: number[];
};

export type SpecialtyListItemDto = {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
};

export type GetSpecialtiesResponse = {
  items: SpecialtyListItemDto[];
};

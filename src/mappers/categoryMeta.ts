import {
  AdvertisementCategory,
  AdvertisementCondition,
  AdvertisementStatus,
} from "@/contracts/common/enums";

export const ADVERTISEMENT_CATEGORY_META: Record<
  AdvertisementCategory,
  { name: string; slug: string; iconName: string; description: string }
> = {
  [AdvertisementCategory.Engine]: {
    name: "Motor",
    slug: "motor",
    iconName: "Cog",
    description: "Peças e componentes para motor.",
  },
  [AdvertisementCategory.Transmission]: {
    name: "Transmissão",
    slug: "transmissao",
    iconName: "Workflow",
    description: "Câmbio, embreagem e transmissão.",
  },
  [AdvertisementCategory.Suspension]: {
    name: "Suspensão",
    slug: "suspensao",
    iconName: "MoveVertical",
    description: "Amortecedores, molas e componentes de suspensão.",
  },
  [AdvertisementCategory.Body]: {
    name: "Carroceria",
    slug: "carroceria",
    iconName: "CarFront",
    description: "Lataria e componentes de carroceria.",
  },
  [AdvertisementCategory.Electrical]: {
    name: "Elétrica",
    slug: "eletrica",
    iconName: "Zap",
    description: "Itens elétricos e baterias.",
  },
  [AdvertisementCategory.Interior]: {
    name: "Interior",
    slug: "interior",
    iconName: "Armchair",
    description: "Acabamento e acessórios internos.",
  },
  [AdvertisementCategory.WheelsAndTires]: {
    name: "Rodas e Pneus",
    slug: "rodas-e-pneus",
    iconName: "CircleDot",
    description: "Rodas, pneus e relacionados.",
  },
  [AdvertisementCategory.Accessory]: {
    name: "Acessórios",
    slug: "acessorios",
    iconName: "PackageOpen",
    description: "Acessórios automotivos em geral.",
  },
  [AdvertisementCategory.Other]: {
    name: "Outros",
    slug: "outros",
    iconName: "Boxes",
    description: "Demais categorias de peças.",
  },
};

export function getCategoryLabel(category: AdvertisementCategory): string {
  return ADVERTISEMENT_CATEGORY_META[category]?.name ?? "Outros";
}

export function isNewCondition(condition: AdvertisementCondition): boolean {
  return condition === AdvertisementCondition.New;
}

const ADVERTISEMENT_STATUS_LABELS: Record<AdvertisementStatus, string> = {
  [AdvertisementStatus.Published]: "Publicado",
  [AdvertisementStatus.Paused]: "Pausado",
  [AdvertisementStatus.Sold]: "Vendido",
  [AdvertisementStatus.Archived]: "Arquivado",
};

export function getStatusLabel(status: AdvertisementStatus): string {
  return ADVERTISEMENT_STATUS_LABELS[status] ?? "Indefinido";
}

const ADVERTISEMENT_CONDITION_LABELS: Record<AdvertisementCondition, string> = {
  [AdvertisementCondition.New]: "Novo",
  [AdvertisementCondition.Used]: "Usado",
  [AdvertisementCondition.Refurbished]: "Recondicionado",
};

export function getConditionLabel(condition: AdvertisementCondition): string {
  return ADVERTISEMENT_CONDITION_LABELS[condition] ?? "Indefinido";
}

export function listAdvertisementConditions(): AdvertisementCondition[] {
  return Object.values(AdvertisementCondition).filter(
    (value): value is AdvertisementCondition => typeof value === "number",
  );
}

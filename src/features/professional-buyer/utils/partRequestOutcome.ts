import { badgeVariants } from "@/components/ui/badge";
import { PartRequestOutcome } from "@/contracts/common/enums";
import type { PartRequestOutcomeFilter } from "@/contracts/part-requests";
import type { VariantProps } from "class-variance-authority";

export function getPartRequestOutcomeLabel(
  outcome: PartRequestOutcome,
): string {
  switch (outcome) {
    case PartRequestOutcome.Found:
      return "Encontrada";
    case PartRequestOutcome.NotFound:
      return "Não encontrada";
    case PartRequestOutcome.Unknown:
    default:
      return "Em andamento";
  }
}

export function getPartRequestOutcomeBadgeVariant(
  outcome: PartRequestOutcome,
): NonNullable<VariantProps<typeof badgeVariants>["variant"]> {
  switch (outcome) {
    case PartRequestOutcome.Found:
      return "success";
    case PartRequestOutcome.NotFound:
      return "destructive";
    case PartRequestOutcome.Unknown:
    default:
      return "outline";
  }
}

export const PART_REQUEST_OUTCOME_FILTER_OPTIONS: {
  value: PartRequestOutcomeFilter;
  label: string;
}[] = [
  { value: "all", label: "Todos" },
  { value: "Unknown", label: "Em andamento" },
  { value: "Found", label: "Encontrada" },
  { value: "NotFound", label: "Não encontrada" },
];

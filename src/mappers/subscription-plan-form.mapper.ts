import type {
  AdminSubscriptionPlanListItemDto,
  CreateAdminSubscriptionPlanRequest,
  UpdateAdminSubscriptionPlanRequest,
} from "@/contracts/admin/subscription-plans";
import type { SubscriptionPlanFormValues } from "@/features/admin/schemas/subscriptionPlanFormSchema";
import { parsePriceInput } from "@/utils/parsePriceInput";

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

/**
 * Plano administrativo (API) → valores do formulário.
 */
export function mapAdminSubscriptionPlanToForm(
  plan: AdminSubscriptionPlanListItemDto,
): SubscriptionPlanFormValues {
  return {
    name: plan.name,
    description: plan.description ?? "",
    price: plan.price.toFixed(2).replace(".", ","),
    advertisementLimit: plan.advertisementLimit,
    displayOrder: plan.displayOrder,
    isActive: plan.isActive,
  };
}

/**
 * Formulário → payload de criação (POST /admin/subscription-plans).
 */
export function mapSubscriptionPlanFormToCreateRequest(
  values: SubscriptionPlanFormValues,
): CreateAdminSubscriptionPlanRequest {
  return {
    name: values.name.trim(),
    description: emptyToUndefined(values.description),
    price: parsePriceInput(values.price),
    advertisementLimit: values.advertisementLimit,
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

/**
 * Formulário → payload de atualização (PUT /admin/subscription-plans/{id}).
 */
export function mapSubscriptionPlanFormToUpdateRequest(
  values: SubscriptionPlanFormValues,
): UpdateAdminSubscriptionPlanRequest {
  return {
    name: values.name.trim(),
    description: emptyToUndefined(values.description),
    price: parsePriceInput(values.price),
    advertisementLimit: values.advertisementLimit,
    displayOrder: values.displayOrder,
    isActive: values.isActive,
  };
}

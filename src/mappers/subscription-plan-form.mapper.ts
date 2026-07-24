import type {
  AdminSubscriptionPlanListItemDto,
  AdminSubscriptionPlanPriceRequest,
  CreateAdminSubscriptionPlanRequest,
  UpdateAdminSubscriptionPlanRequest,
} from "@/contracts/admin/subscription-plans";
import type {
  SubscriptionPlanFormValues,
  SubscriptionPlanPriceFormValues,
} from "@/features/admin/schemas/subscriptionPlanFormSchema";
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
    advertisementLimit: plan.advertisementLimit,
    displayOrder: plan.displayOrder,
    isActive: plan.isActive,
    prices: [...plan.prices]
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map((price) => ({
        id: price.id,
        billingCycle: price.billingCycle,
        price: price.price.toFixed(2).replace(".", ","),
        displayName: price.displayName ?? "",
        description: price.description ?? "",
        displayOrder: price.displayOrder,
        isActive: price.isActive,
        isRecommended: price.isRecommended ?? false,
      })),
  };
}

function mapPriceFormToRequest(
  price: SubscriptionPlanPriceFormValues,
): AdminSubscriptionPlanPriceRequest {
  return {
    id: price.id,
    billingCycle: price.billingCycle,
    price: parsePriceInput(price.price),
    displayName: emptyToUndefined(price.displayName),
    description: emptyToUndefined(price.description),
    displayOrder: price.displayOrder,
    isActive: price.isActive,
    isRecommended: price.isRecommended,
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
    advertisementLimit: values.advertisementLimit,
    displayOrder: values.displayOrder,
    isActive: values.isActive,
    prices: values.prices.map(mapPriceFormToRequest),
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
    advertisementLimit: values.advertisementLimit,
    displayOrder: values.displayOrder,
    isActive: values.isActive,
    prices: values.prices.map(mapPriceFormToRequest),
  };
}

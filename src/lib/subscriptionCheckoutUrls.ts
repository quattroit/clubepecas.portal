import { ROUTES } from "@/constants/routes";

/** URLs de callback do checkout Asaas (localhost → 127.0.0.1). */
export function buildSubscriptionCheckoutUrls() {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://127.0.0.1:3000";
  const normalizedOrigin = origin.replace(
    /:\/\/localhost(?=[:/]|$)/i,
    "://127.0.0.1",
  );
  const base = `${normalizedOrigin}${ROUTES.MY_PLAN}`;

  return {
    successUrl: `${base}?checkout=success`,
    cancelUrl: `${base}?checkout=cancel`,
    expiredUrl: `${base}?checkout=expired`,
  };
}

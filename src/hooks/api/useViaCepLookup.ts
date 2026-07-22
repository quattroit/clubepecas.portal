import { useQuery } from "@tanstack/react-query";

import { normalizePostalCode } from "@/utils/postalCode";

type ViaCepResponse = {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
};

export type ViaCepLookupResult = {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
};

async function fetchViaCep(postalCode: string): Promise<ViaCepLookupResult | null> {
  const response = await fetch(`https://viacep.com.br/ws/${postalCode}/json/`);

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as ViaCepResponse;

  if (data.erro) {
    return null;
  }

  const city = data.localidade?.trim() ?? "";
  const state = data.uf?.trim() ?? "";
  if (!city || !state) {
    return null;
  }

  return {
    street: data.logradouro?.trim() ?? "",
    neighborhood: data.bairro?.trim() ?? "",
    city,
    state,
  };
}

export function useViaCepLookup(postalCode: string, enabled: boolean) {
  const digits = normalizePostalCode(postalCode);

  return useQuery({
    queryKey: ["viacep", digits],
    queryFn: () => fetchViaCep(digits),
    enabled: enabled && digits.length === 8,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
}

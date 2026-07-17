import { PersonType } from "@/contracts/common/enums";

/** Mantém apenas dígitos. */
export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function isValidCpf(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number(digits[i]) * (10 - i);
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (Number(digits[9]) !== digit1) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number(digits[i]) * (11 - i);
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  return Number(digits[10]) === digit2;
}

export function isValidCnpj(value: string): boolean {
  const digits = onlyDigits(value);
  if (digits.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const weight1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weight2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += Number(digits[i]) * weight1[i]!;
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (Number(digits[12]) !== digit1) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += Number(digits[i]) * weight2[i]!;
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  return Number(digits[13]) === digit2;
}

export function isValidDocument(
  value: string,
  personType: PersonType,
): boolean {
  return personType === PersonType.Individual
    ? isValidCpf(value)
    : isValidCnpj(value);
}

/** Aplica máscara progressiva conforme o tipo de pessoa. */
export function formatDocumentInput(
  value: string,
  personType: PersonType,
): string {
  const digits = onlyDigits(value);

  if (personType === PersonType.Individual) {
    const limited = digits.slice(0, 11);
    if (limited.length <= 3) return limited;
    if (limited.length <= 6) {
      return `${limited.slice(0, 3)}.${limited.slice(3)}`;
    }
    if (limited.length <= 9) {
      return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6)}`;
    }
    return `${limited.slice(0, 3)}.${limited.slice(3, 6)}.${limited.slice(6, 9)}-${limited.slice(9)}`;
  }

  const limited = digits.slice(0, 14);
  if (limited.length <= 2) return limited;
  if (limited.length <= 5) {
    return `${limited.slice(0, 2)}.${limited.slice(2)}`;
  }
  if (limited.length <= 8) {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5)}`;
  }
  if (limited.length <= 12) {
    return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8)}`;
  }
  return `${limited.slice(0, 2)}.${limited.slice(2, 5)}.${limited.slice(5, 8)}/${limited.slice(8, 12)}-${limited.slice(12)}`;
}

export function documentLabel(personType: PersonType): string {
  return personType === PersonType.Individual ? "CPF" : "CNPJ";
}

export function documentPlaceholder(personType: PersonType): string {
  return personType === PersonType.Individual
    ? "000.000.000-00"
    : "00.000.000/0000-00";
}

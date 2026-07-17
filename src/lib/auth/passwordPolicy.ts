import { z } from "zod";

/** Mesmas regras do backend (PasswordPolicy). */
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_LETTER_REGEX = /[A-Za-zÀ-ÿ]/;
export const PASSWORD_DIGIT_REGEX = /[0-9]/;

export type PasswordRuleKey = "minLength" | "hasLetter" | "hasDigit";

export type PasswordRulesState = Record<PasswordRuleKey, boolean>;

export const PASSWORD_RULES: ReadonlyArray<{
  key: PasswordRuleKey;
  label: string;
}> = [
  { key: "minLength", label: "Mínimo de 8 caracteres" },
  { key: "hasLetter", label: "Pelo menos uma letra" },
  { key: "hasDigit", label: "Pelo menos um número" },
];

/**
 * Avalia a política de senha em tempo real — reutilizado pelos indicadores visuais.
 */
export function evaluatePasswordRules(password: string): PasswordRulesState {
  return {
    minLength: password.length >= PASSWORD_MIN_LENGTH,
    hasLetter: PASSWORD_LETTER_REGEX.test(password),
    hasDigit: PASSWORD_DIGIT_REGEX.test(password),
  };
}

/**
 * Política de senha alinhada ao backend (PasswordPolicy).
 * Reutilizar em cadastro, alteração e recuperação.
 */
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, "A senha deve possuir pelo menos 8 caracteres")
  .refine(
    (value) => PASSWORD_LETTER_REGEX.test(value),
    "A senha deve conter pelo menos uma letra",
  )
  .refine(
    (value) => PASSWORD_DIGIT_REGEX.test(value),
    "A senha deve conter pelo menos um número",
  );

export const PASSWORD_HINT =
  "Mínimo 8 caracteres, com pelo menos uma letra e um número.";

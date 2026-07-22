import { z } from "zod";

import { passwordSchema } from "@/lib/auth/passwordPolicy";

/**
 * Schema do formulário de alteração de senha (portal do representante → perfil → segurança).
 */
export const representativeChangePasswordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Informe a senha atual"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "A confirmação da senha não confere",
    path: ["confirmPassword"],
  })
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: "A nova senha deve ser diferente da senha atual",
    path: ["newPassword"],
  });

export type RepresentativeChangePasswordFormValues = z.infer<
  typeof representativeChangePasswordFormSchema
>;

export const representativeChangePasswordFormDefaultValues: RepresentativeChangePasswordFormValues =
  {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

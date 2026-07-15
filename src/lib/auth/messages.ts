import {
  ApiError,
  ForbiddenError,
  UnauthorizedError,
} from "@/lib/errors";

const CODE_MESSAGES: Record<string, string> = {
  "authentication.invalid_credentials": "E-mail ou senha inválidos.",
  "authentication.user_inactive":
    "Sua conta está inativa. Entre em contato com o suporte.",
  "authentication.email.required": "Informe o e-mail.",
  "authentication.password.required": "Informe a senha.",
  "authentication.unauthorized": "Sua sessão expirou. Faça login novamente.",
  "authentication.user_not_found": "Usuário não encontrado.",
  "user.first_name.required": "Informe o nome.",
  "user.last_name.required": "Informe o sobrenome.",
  "user.email.required": "Informe o e-mail.",
  "user.password.min_length": "A senha deve ter pelo menos 8 caracteres.",
  "user.email.already_exists": "Este e-mail já está cadastrado.",
  "advertisement.title.required": "Informe o título do anúncio.",
  "advertisement.description.required": "Informe a descrição do anúncio.",
  "advertisement.compatibility_description.required":
    "Informe a compatibilidade da peça.",
  "advertisement.price.invalid": "O preço deve ser maior que zero.",
  "advertisement.not_found": "Anúncio não encontrado.",
  "advertisement.forbidden": "Você não tem permissão para alterar este anúncio.",
  "seller.not_found":
    "É necessário um perfil de vendedor para publicar anúncios.",
  "seller.already_exists": "Você já possui um perfil de vendedor.",
  "seller.store_name.required": "Informe o nome da loja.",
  "seller.display_name.required": "Informe o nome de exibição.",
  "seller.city.required": "Informe a cidade.",
  "seller.state.required": "Informe o estado.",
  "photo.url.required": "Informe a URL da foto.",
  "network.timeout": "A requisição demorou demais. Tente novamente.",
  "network.unavailable":
    "Não foi possível conectar ao servidor. Verifique sua conexão.",
  "server.error": "Ocorreu um erro no servidor. Tente novamente em instantes.",
  forbidden: "Você não tem permissão para esta ação.",
  "validation.failed": "Dados inválidos. Verifique o formulário.",
};

/**
 * Mensagens amigáveis — nunca exibe o erro bruto da API.
 */
export function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof UnauthorizedError) {
    return (
      CODE_MESSAGES[error.code ?? ""] ??
      CODE_MESSAGES["authentication.unauthorized"]
    );
  }

  if (error instanceof ForbiddenError) {
    return CODE_MESSAGES[error.code ?? ""] ?? CODE_MESSAGES.forbidden;
  }

  if (error instanceof ApiError) {
    if (error.code && CODE_MESSAGES[error.code]) {
      return CODE_MESSAGES[error.code];
    }

    const mapped = error.errors
      .map((item) => CODE_MESSAGES[item.code])
      .find(Boolean);

    if (mapped) return mapped;
  }

  return "Não foi possível concluir a operação. Tente novamente.";
}

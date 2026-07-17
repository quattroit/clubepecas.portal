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
  "authentication.admin_required":
    "Acesso restrito a administradores. Utilize o login administrativo.",
  "authentication.seller_login_required":
    "Esta conta é administrativa. Utilize o acesso em /loginAdm.",
  "authentication.user_not_found": "Usuário não encontrado.",
  "user.first_name.required": "Informe o nome.",
  "user.last_name.required": "Informe o sobrenome.",
  "user.email.required": "Informe o e-mail.",
  "user.password.min_length":
    "A senha deve possuir pelo menos 8 caracteres.",
  "user.password.require_letter":
    "A senha deve conter pelo menos uma letra.",
  "user.password.require_digit":
    "A senha deve conter pelo menos um número.",
  "user.password.current_required": "Informe a senha atual.",
  "user.password.current_invalid": "Senha atual incorreta.",
  "user.password.confirmation_mismatch":
    "A confirmação da senha não confere.",
  "user.password.same_as_current":
    "A nova senha deve ser diferente da senha atual.",
  "user.email.invalid": "Informe um e-mail válido.",
  "auth.reset_token.invalid":
    "Link de redefinição inválido ou expirado. Solicite um novo envio.",
  "auth.reset_token.expired":
    "Este link expirou. Solicite um novo envio.",
  "auth.reset_token.used":
    "Este link já foi utilizado. Solicite um novo envio.",
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
  "seller.cityId.required": "Selecione a cidade.",
  "seller.cityId.invalid": "Selecione uma cidade válida.",
  "seller.state.required": "Informe o estado.",
  "city.not_found": "Cidade não encontrada.",
  "city.name.required": "Informe o nome da cidade.",
  "city.state.required": "Informe o estado (UF).",
  "city.state.invalid": "Informe uma UF válida com 2 letras.",
  "city.slug.duplicate": "Já existe uma cidade com este slug.",
  "city.name_state.duplicate": "Já existe uma cidade com este nome neste estado.",
  "vehicle_brand.not_found": "Marca não encontrada.",
  "vehicle_brand.name.required": "Informe o nome da marca.",
  "vehicle_brand.slug.duplicate": "Já existe uma marca com este slug.",
  "vehicle_brand.name.duplicate": "Já existe uma marca com este nome.",
  "vehicle_model.not_found": "Modelo não encontrado.",
  "vehicle_model.name.required": "Informe o nome do modelo.",
  "vehicle_model.brand.required": "Selecione a marca do modelo.",
  "vehicle_model.slug.duplicate": "Já existe um modelo com este slug.",
  "vehicle_model.name.duplicate": "Já existe um modelo com este nome nesta marca.",
  "advertisement.vehicleBrandId.required": "Selecione a marca do veículo.",
  "advertisement.vehicleBrandId.invalid": "Selecione uma marca válida.",
  "advertisement.vehicleModelId.required": "Selecione o modelo do veículo.",
  "advertisement.vehicleModelId.invalid": "Selecione um modelo válido.",
  "advertisement.manufacturing_year.invalid":
    "Informe um ano de fabricação válido.",
  "advertisement.model_year.invalid": "Informe um ano/modelo válido.",
  "category.not_found": "Categoria não encontrada.",
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

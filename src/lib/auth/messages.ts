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
  "auth.account_locked":
    "Conta temporariamente bloqueada. Tente novamente mais tarde.",
  "rate_limit.exceeded":
    "Muitas requisições. Aguarde um momento e tente novamente.",
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
  "advertisement.subscription.required":
    "Você precisa contratar um plano para publicar anúncios.",
  "advertisement.subscription.plan_inactive":
    "O plano associado à sua assinatura está indisponível.",
  "advertisement.limit.reached":
    "Você atingiu o limite de anúncios permitido pelo seu plano.",
  "seller.subscription.already_active":
    "Você já possui uma assinatura ativa. Cancele a atual antes de assinar outro plano.",
  "seller.document.already_exists":
    "Já existe um vendedor cadastrado com este CPF ou CNPJ.",
  "seller.document.invalid": "Informe um CPF ou CNPJ válido.",
  "seller.document.required": "Informe o CPF ou CNPJ.",
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
  "admin.subscription_plans.not_found": "Plano não encontrado.",
  "admin.subscription_plans.name.required": "Informe o nome do plano.",
  "admin.subscription_plans.name.duplicate":
    "Já existe um plano com este nome.",
  "admin.subscription_plans.slug.duplicate":
    "Já existe um plano com este slug.",
  "admin.subscription_plans.description.max_length":
    "A descrição deve ter no máximo 1000 caracteres.",
  "admin.subscription_plans.price.invalid":
    "Informe um preço válido (zero ou maior).",
  "admin.subscription_plans.advertisement_limit.invalid":
    "Informe um limite de anúncios válido (zero ou maior).",
  "admin.subscription_plans.display_order.invalid":
    "Informe uma ordem de exibição válida (zero ou maior).",
  "admin.subscription_plans.in_use":
    "Este plano não pode ser excluído pois está em uso.",
  "photo.url.required": "Informe a URL da foto.",
  "photo.file.required": "Selecione um arquivo de imagem.",
  "photo.extension.invalid":
    "Extensão de arquivo não permitida. Use JPG, JPEG, PNG ou WEBP.",
  "photo.content_type.invalid":
    "Tipo de arquivo não permitido. Envie uma imagem JPG, PNG ou WEBP.",
  "photo.content_type.mismatch":
    "A extensão do arquivo não corresponde ao tipo de conteúdo.",
  "photo.file.too_large": "O arquivo excede o limite permitido.",
  "photo.limit.reached": "Limite de fotos por anúncio atingido.",
  "photo.upload.failed": "Não foi possível salvar o arquivo. Tente novamente.",
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
    if (error.code === "auth.account_locked") {
      const apiMessage = error.errors
        .find((item) => item.code === "auth.account_locked")
        ?.message?.trim();
      return apiMessage || CODE_MESSAGES["auth.account_locked"];
    }

    return (
      CODE_MESSAGES[error.code ?? ""] ??
      CODE_MESSAGES["authentication.unauthorized"]
    );
  }

  if (error instanceof ForbiddenError) {
    if (error.code === "auth.account_locked") {
      const apiMessage = error.errors
        .find((item) => item.code === "auth.account_locked")
        ?.message?.trim();
      return apiMessage || CODE_MESSAGES["auth.account_locked"];
    }

    return CODE_MESSAGES[error.code ?? ""] ?? CODE_MESSAGES.forbidden;
  }

  if (error instanceof ApiError) {
    if (error.code === "auth.account_locked") {
      const apiMessage = error.errors
        .find((item) => item.code === "auth.account_locked")
        ?.message?.trim();
      return apiMessage || CODE_MESSAGES["auth.account_locked"];
    }

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

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
    "Esta conta é administrativa. Utilize o acesso em /loginadm.",
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
  "user.document.required": "Informe o CPF ou CNPJ.",
  "user.document.invalid": "Informe um CPF ou CNPJ válido.",
  "user.document.already_exists":
    "Já existe um cadastro vinculado a este CPF ou CNPJ.",
  "user.phone_number.required": "Informe o telefone.",
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
  "seller.subscription.demo_already_used":
    "Você já utilizou o plano demonstração.",
  "seller.subscription.not_found":
    "Nenhuma assinatura ativa encontrada.",
  "seller.subscription.plan_not_found": "Plano de assinatura não encontrado.",
  "seller.subscription.document_required":
    "Informe CPF ou CNPJ no perfil da loja antes de assinar um plano.",
  "seller.address.required":
    "Complete o endereço no perfil da loja (CEP, logradouro, número e bairro) antes de assinar um plano.",
  "seller.postal_code.required": "Informe o CEP.",
  "seller.postal_code.invalid": "Informe um CEP válido com 8 dígitos.",
  "seller.street.required": "Informe o logradouro.",
  "seller.address_number.required": "Informe o número.",
  "seller.neighborhood.required": "Informe o bairro.",
  "payment.checkout.urls_required":
    "Não foi possível iniciar o checkout. Atualize a página e tente novamente.",
  "payment.checkout.failed":
    "Não foi possível iniciar o checkout. Tente novamente.",
  "payment.provider.error":
    "Não foi possível conectar ao gateway de pagamento. Tente novamente em instantes.",
  "payment.provider.configuration":
    "Pagamentos não configurados. A chave de API do Asaas (Sandbox) precisa ser configurada no servidor.",
  "seller.document.already_exists":
    "Já existe um vendedor cadastrado com este CPF ou CNPJ.",
  "seller.document.invalid": "Informe um CPF ou CNPJ válido.",
  "seller.document.required": "Informe o CPF ou CNPJ.",
  "seller.store_name.required": "Informe o nome da loja.",
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
  "admin.subscription_plans.prices.required":
    "Adicione ao menos um ciclo de cobrança.",
  "admin.subscription_plans.prices.price.invalid":
    "Informe um preço válido (zero ou maior) para o ciclo de cobrança.",
  "admin.subscription_plans.prices.billing_cycle.duplicate":
    "Cada ciclo de cobrança pode ser adicionado apenas uma vez.",
  "admin.representatives.not_found": "Representante não encontrado.",
  "admin.representatives.name.required": "Informe o nome.",
  "admin.representatives.email.required": "Informe o e-mail.",
  "admin.representatives.email.invalid": "Informe um e-mail válido.",
  "admin.representatives.email.duplicate":
    "Já existe um representante com este e-mail.",
  "admin.representatives.phone.required": "Informe o telefone.",
  "admin.representatives.phone.invalid": "Informe um telefone válido.",
  "admin.representatives.document.required": "Informe o CPF.",
  "admin.representatives.document.invalid": "Informe um CPF válido.",
  "admin.representatives.document.duplicate":
    "Já existe um representante com este CPF.",
  "admin.representatives.zip_code.required": "Informe o CEP.",
  "admin.representatives.zip_code.invalid":
    "Informe um CEP válido com 8 dígitos.",
  "admin.representatives.address_street.required": "Informe o logradouro.",
  "admin.representatives.address_number.required": "Informe o número.",
  "admin.representatives.neighborhood.required": "Informe o bairro.",
  "admin.representatives.city.required": "Informe a cidade.",
  "admin.representatives.state.required": "Informe a UF.",
  "admin.representatives.state.invalid": "Informe uma UF válida.",
  "admin.representatives.status.invalid": "Status inválido.",
  "professional_buyer.not_found": "Comprador profissional não encontrado.",
  "professional_buyer.email.already_exists":
    "Já existe um comprador com este e-mail.",
  "professional_buyer.document.already_exists":
    "Já existe um comprador com este documento.",
  "professional_buyer.company_name.required": "Informe o nome fantasia.",
  "professional_buyer.corporate_name.required": "Informe a razão social.",
  "professional_buyer.document.required": "Informe o CPF ou CNPJ.",
  "professional_buyer.contact_name.required": "Informe o nome do contato.",
  "professional_buyer.email.required": "Informe o e-mail.",
  "professional_buyer.phone.required": "Informe o telefone.",
  "professional_buyer.whatsapp.required": "Informe o WhatsApp.",
  "professional_buyer.city_id.required": "Selecione a cidade.",
  "professional_buyer.address.required": "Informe o endereço.",
  "professional_buyer.number.required": "Informe o número.",
  "professional_buyer.neighborhood.required": "Informe o bairro.",
  "professional_buyer.zip_code.required": "Informe o CEP.",
  "professional_buyer.zip_code.invalid":
    "Informe um CEP válido com 8 dígitos.",
  "professional_buyer.segment.invalid": "Segmento inválido.",
  "part_request.not_found": "Solicitação não encontrada.",
  "part_request.forbidden":
    "Você não tem permissão para acessar esta solicitação.",
  "part_request.not_editable":
    "Não é possível editar uma solicitação cancelada ou concluída.",
  "part_request.not_cancellable":
    "Não é possível cancelar esta solicitação.",
  "part_request.already_completed":
    "Esta solicitação já foi concluída e não pode ser alterada.",
  "part_request.not_completable":
    "Não é possível concluir esta solicitação.",
  "part_request.outcome.invalid":
    "Informe se a peça foi encontrada ou não.",
  "part_request.winning_seller.required":
    "Selecione o fornecedor com quem a peça foi encontrada.",
  "part_request.winning_seller.not_allowed":
    "Não informe fornecedor quando a peça não foi encontrada.",
  "part_request.winning_seller.invalid":
    "Fornecedor inválido para esta solicitação.",
  "part_request.winning_seller.not_selected":
    "O fornecedor informado não está selecionado nesta solicitação.",
  "part_request.closing_notes.max_length":
    "As observações excedem o limite de caracteres.",
  "part_request.title.required": "Informe o título.",
  "part_request.title.max_length": "O título excede o limite de caracteres.",
  "part_request.description.max_length":
    "A descrição excede o limite de caracteres.",
  "part_request.vehicle_brand.required": "Selecione a marca.",
  "part_request.vehicle_brand.invalid": "Selecione uma marca válida.",
  "part_request.vehicle_model.required": "Selecione o modelo.",
  "part_request.vehicle_model.invalid": "Selecione um modelo válido.",
  "part_request.manufacturing_year.required":
    "Informe o ano de fabricação.",
  "part_request.manufacturing_year.invalid":
    "Informe um ano de fabricação válido.",
  "part_request.model_year.invalid": "Informe um ano/modelo válido.",
  "part_request.engine.max_length": "O motor excede o limite de caracteres.",
  "part_request.category.required": "Selecione a categoria.",
  "part_request.category.invalid": "Selecione uma categoria válida.",
  "part_request.requested_quantity.invalid":
    "A quantidade deve ser maior que zero.",
  "part_request.city.required": "Selecione a cidade.",
  "part_request.city.invalid": "Selecione uma cidade válida.",
  "part_request.maximum_suppliers.invalid":
    "A quantidade de fornecedores deve ser entre 1 e 10.",
  "part_request.status.invalid": "Status inválido.",
  "part_request.invalid": "Dados da solicitação inválidos.",
  "part_request.suppliers.limit_exceeded":
    "Você atingiu o limite de fornecedores selecionados para esta solicitação.",
  "part_request.suppliers.invalid":
    "Não foi possível atualizar a seleção de fornecedores.",
  "part_request.suppliers.duplicate":
    "A lista de fornecedores selecionados contém duplicatas.",
  "part_request.suppliers.seller_id.invalid":
    "Um ou mais fornecedores selecionados são inválidos.",
  "whatsapp.missing": "Este fornecedor não possui WhatsApp cadastrado.",
  "seller_inactive": "Este fornecedor está inativo.",
  "seller_not_found": "Fornecedor não encontrado.",
  "not_selected":
    "Este fornecedor não está selecionado para esta solicitação.",
  "part_request.suppliers.whatsapp.missing":
    "Este fornecedor não possui WhatsApp cadastrado.",
  "part_request.suppliers.seller_inactive": "Este fornecedor está inativo.",
  "part_request.suppliers.seller_not_found": "Fornecedor não encontrado.",
  "part_request.suppliers.not_selected":
    "Este fornecedor não está selecionado para esta solicitação.",
  "representative.code.required": "Informe o código do representante.",
  "representative.code.not_found": "Código de representante inválido.",
  "representative.code.inactive":
    "Este representante está inativo e não pode ser vinculado.",
  "seller.representative.already_linked":
    "Este vendedor já possui um representante vinculado.",
  "seller.subscription.billing_cycle.required":
    "Selecione o ciclo de cobrança.",
  "seller.subscription.billing_cycle.invalid":
    "Este plano não oferece o ciclo de cobrança selecionado.",
  "photo.file.required": "Selecione um arquivo de imagem.",
  "photo.extension.invalid":
    "Extensão de arquivo não permitida. Use JPG, JPEG, PNG ou WEBP.",
  "photo.content_type.invalid":
    "Tipo de arquivo não permitido. Envie uma imagem JPG, PNG ou WEBP.",
  "photo.content_type.mismatch":
    "A extensão do arquivo não corresponde ao tipo de conteúdo.",
  "photo.signature.invalid":
    "O conteúdo do arquivo não é uma imagem JPG, PNG ou WEBP válida.",
  "photo.signature.mismatch":
    "A extensão do arquivo não corresponde ao conteúdo real da imagem.",
  "photo.processing.failed":
    "Não foi possível processar a imagem. Tente outro arquivo.",
  "photo.file.too_large": "O arquivo excede o limite permitido.",
  "photo.limit.reached": "Limite de fotos por anúncio atingido.",
  "photo.upload.failed": "Não foi possível salvar o arquivo. Tente novamente.",
  "photo.order.required": "Informe a lista ordenada de fotos.",
  "photo.order.incomplete":
    "A lista deve conter exatamente todas as fotos do anúncio.",
  "photo.order.duplicate": "A lista de fotos contém IDs duplicados.",
  "network.unavailable":
    "Não foi possível conectar ao servidor. Verifique sua conexão.",
  "network.timeout": "A requisição demorou demais. Tente novamente.",
  "server.error":
    "Ocorreu um erro no servidor. Tente novamente em instantes.",
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

    const apiMessage = error.message?.trim();
    if (apiMessage && apiMessage !== "Erro na requisição") {
      return apiMessage;
    }
  }

  return "Não foi possível concluir a operação. Tente novamente.";
}

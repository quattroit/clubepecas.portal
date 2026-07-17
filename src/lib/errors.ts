import axios from "axios";

import type {
  BackendErrorItem,
  BackendUnhandledError,
} from "@/contracts/common/errors";

export function isCanceledError(error: unknown): boolean {
  return axios.isCancel(error) || (axios.isAxiosError(error) && error.code === "ERR_CANCELED");
}

export class ApiError extends Error {
  readonly statusCode?: number;
  readonly code?: string;
  readonly errors: BackendErrorItem[];

  constructor(
    message: string,
    options?: {
      statusCode?: number;
      code?: string;
      errors?: BackendErrorItem[];
    },
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = options?.statusCode;
    this.code = options?.code;
    this.errors = options?.errors ?? [];
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    options?: {
      statusCode?: number;
      code?: string;
      errors?: BackendErrorItem[];
    },
  ) {
    super(message, { statusCode: options?.statusCode ?? 400, ...options });
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends ApiError {
  constructor(
    message = "Não autorizado",
    options?: { code?: string; errors?: BackendErrorItem[] },
  ) {
    super(message, { statusCode: 401, ...options });
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends ApiError {
  constructor(
    message = "Acesso negado",
    options?: { code?: string; errors?: BackendErrorItem[] },
  ) {
    super(message, { statusCode: 403, ...options });
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends ApiError {
  constructor(
    message = "Recurso não encontrado",
    options?: { code?: string; errors?: BackendErrorItem[] },
  ) {
    super(message, { statusCode: 404, ...options });
    this.name = "NotFoundError";
  }
}

function isBackendErrorArray(data: unknown): data is BackendErrorItem[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        "code" in item &&
        "message" in item,
    )
  );
}

function isUnhandledError(data: unknown): data is BackendUnhandledError {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as BackendUnhandledError).success === false &&
    "message" in data
  );
}

/**
 * Converte erros Axios / backend nos tipos padronizados do frontend.
 */
export function mapAxiosError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!axios.isAxiosError(error)) {
    return new ApiError(
      error instanceof Error ? error.message : "Erro inesperado",
      { code: "unexpected" },
    );
  }

  const statusCode = error.response?.status;
  const data = error.response?.data;

  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return new ApiError("A requisição demorou demais. Tente novamente.", {
        code: "network.timeout",
      });
    }

    return new ApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão.",
      { code: "network.unavailable" },
    );
  }

  if (isBackendErrorArray(data)) {
    const first = data[0];
    const message = first?.message ?? "Erro na requisição";
    const code = first?.code;
    const options = { statusCode, code, errors: data };

    if (statusCode === 401) return new UnauthorizedError(message, options);
    if (statusCode === 403) return new ForbiddenError(message, options);
    if (statusCode === 404) return new NotFoundError(message, options);
    if (statusCode === 400 || statusCode === 409 || statusCode === 422) {
      return new ValidationError(message, options);
    }
    return new ApiError(message, options);
  }

  if (isUnhandledError(data)) {
    return new ApiError(data.message, {
      statusCode,
      code: "unhandled",
      errors: data.errors.map((message) => ({
        code: "unhandled",
        message,
      })),
    });
  }

  if (statusCode === 401) {
    return new UnauthorizedError("Sua sessão expirou. Faça login novamente.", {
      code: "authentication.unauthorized",
    });
  }

  if (statusCode === 403) {
    return new ForbiddenError("Você não tem permissão para esta ação.", {
      code: "forbidden",
    });
  }

  if (statusCode === 404) {
    return new NotFoundError("Recurso não encontrado.");
  }

  if (statusCode === 422) {
    return new ValidationError("Dados inválidos. Verifique o formulário.", {
      statusCode: 422,
      code: "validation.failed",
    });
  }

  if (statusCode && statusCode >= 500) {
    return new ApiError(
      "Ocorreu um erro no servidor. Tente novamente em instantes.",
      { statusCode, code: "server.error" },
    );
  }

  return new ApiError("Não foi possível concluir a operação. Tente novamente.", {
    statusCode,
    code: "request.failed",
  });
}

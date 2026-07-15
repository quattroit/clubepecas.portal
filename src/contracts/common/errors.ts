/**
 * Erro de domínio retornado pelos controllers do backend.
 * Body típico: Error[]
 */
export type BackendErrorItem = {
  code: string;
  message: string;
};

/**
 * Envelope de erro não tratado (middleware — HTTP 500).
 */
export type BackendUnhandledError = {
  success: false;
  message: string;
  errors: string[];
  traceId: string;
};

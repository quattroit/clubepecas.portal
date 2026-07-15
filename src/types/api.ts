/**
 * Notas sobre envelopes da API.
 *
 * Os controllers do MVP retornam DTOs crus (não ApiResponse<T>).
 * Erros de domínio: BackendErrorItem[] ({ code, message }).
 * Este arquivo permanece apenas como referência legada / utilitária.
 */

export type { BackendErrorItem } from "@/contracts/common/errors";

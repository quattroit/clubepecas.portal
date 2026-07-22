# Integração com a API — ClubePeças Frontend

Documento oficial da camada de integração (atualizado na Sprint 4.0).

---

## 1. Arquitetura

```
API (Backend MVP)
        ↓
   DTO (src/contracts)
        ↓
 Service (src/services)  — métodos HTTP via api.ts
        ↓
 Mapper (src/mappers)    — DTO → Modelo de UI
        ↓
 Model (src/types)       — Advertisement | Seller | Category | AuthSession
        ↓
 Hook (src/hooks/api)    — TanStack Query
        ↓
 Componentes / Páginas
```

Regras:

- Componentes **nunca** conversam com Axios diretamente.
- Componentes **nunca** mapeiam DTOs.
- Services retornam **DTOs** (contrato do backend).
- Mappers produzem **modelos de UI**.
- Hooks orquestram service + mapper + cache.

---

## 2. Pastas

| Pasta | Responsabilidade |
| --- | --- |
| `src/contracts/` | Requests, Responses e enums exatamente como o backend |
| `src/services/` | Chamadas HTTP |
| `src/mappers/` | Conversão DTO → Model |
| `src/types/` | Modelos usados pela interface |
| `src/lib/api.ts` | Cliente Axios (JWT, timeout 15s, tratamento 401) |
| `src/lib/errors.ts` | Erros padronizados + `mapAxiosError` |
| `src/lib/auth/messages.ts` | Mensagens amigáveis por código HTTP/domínio |
| `src/lib/queryKeys.ts` | Chaves do TanStack Query |
| `src/hooks/api/` | Hooks de consumo na UI |

---

## 3. Contratos do backend (resumo)

Base URL: `NEXT_PUBLIC_API_URL`

| Domínio | Endpoints principais |
| --- | --- |
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| Anúncios | CRUD `/api/v1/advertisements`, público `GET /api/v1/advertisements/{slug}`, fotos |
| Marketplace | `GET /api/v1/marketplace` (filtros: title, category, city, state) |
| Seller | `POST/GET/PUT /api/v1/seller`, público `GET /api/v1/sellers/{slug}` |
| Admin — Representantes | CRUD `/api/v1/admin/representatives` (+ activate/deactivate). UI: `/admin/representantes`. ViaCEP só no frontend. |
| Representantes — vínculo | `POST /api/v1/representatives/validate-code` (público). Checkout aceita `representativeCode`. Admin: `PUT /api/v1/admin/sellers/{id}/representative`. |

**Importante:**

- Controllers devolvem DTOs crus (não `ApiResponse<T>`).
- Erros de domínio: array `{ code, message }[]`.
- Categorias **não** possuem CRUD — usam o enum `AdvertisementCategory`.

---

## 4. Erros padronizados

| Classe | Uso típico |
| --- | --- |
| `ApiError` | Genérico / rede / timeout / 5xx |
| `ValidationError` | HTTP 400 / 409 / 422 |
| `UnauthorizedError` | HTTP 401 |
| `ForbiddenError` | HTTP 403 |
| `NotFoundError` | HTTP 404 |

O interceptor de resposta:

1. Converte falhas via `mapAxiosError`.
2. Em **401** com sessão local presente: limpa sessão, exibe toast e redireciona para `/login`.
3. Mensagens exibidas na UI passam por `getFriendlyErrorMessage` (nunca o payload bruto).

Timeout de rede: **15s** (`ECONNABORTED` → mensagem amigável).

---

## 5. Como adicionar um novo endpoint

1. **Contrato** em `src/contracts/<domínio>/` (request + response).
2. **Método** no service correspondente (`src/services/*.service.ts`).
3. **Mapper** se a UI precisar de modelo diferente do DTO.
4. **Query key** em `src/lib/queryKeys.ts`.
5. **Hook** em `src/hooks/api/`.
6. Consumir o hook na view — sem alterar contratos de props dos componentes base.

---

## 6. Estado da migração (mocks → API)

| Superfície | Fonte de dados |
| --- | --- |
| Marketplace público | API |
| Auth (login / cadastro) | API |
| Dashboard (anúncios / seller) | API |
| `/anunciar` | redirect do fluxo Anunciar (sem UI) |

---

## 7. Serviços disponíveis

- `authenticationService`
- `advertisementService`
- `categoryService`
- `sellerService`

Views consomem esses serviços **somente** via hooks em `src/hooks/api/`.

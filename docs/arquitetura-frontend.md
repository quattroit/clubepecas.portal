# Arquitetura Frontend — ClubePeças Portal

Documento de referência do frontend MVP (atualizado na Sprint 4.0).

---

## 1. Stack

| Tecnologia | Uso |
| --- | --- |
| Next.js (App Router) | Rotas, layouts, metadata SEO |
| TypeScript | Tipagem end-to-end |
| Tailwind CSS | Design System / tokens |
| Axios | Cliente HTTP (`src/lib/api.ts`) |
| TanStack Query | Cache e estado assíncrono |
| React Hook Form + Zod | Formulários e validação client-side |
| Sonner | Toasts |

---

## 2. Fluxo de dados

```
API (Backend)
    ↓
DTO (src/contracts)
    ↓
Service (src/services) — HTTP via api.ts
    ↓
Mapper (src/mappers) — DTO → modelo de UI
    ↓
Model (src/types)
    ↓
Hook (src/hooks/api) — TanStack Query
    ↓
Views / Pages (src/features, src/app)
```

Regras:

- Componentes **não** chamam Axios.
- Componentes **não** mapeiam DTOs.
- Services devolvem DTOs; mappers produzem modelos de UI.
- Hooks orquestram service + mapper + cache.

---

## 3. Estrutura de pastas (relevante)

| Pasta | Responsabilidade |
| --- | --- |
| `src/app/` | Rotas App Router (público, auth, dashboard) |
| `src/features/` | Views e UI de domínio (marketplace, dashboard) |
| `src/components/` | UI compartilhada, auth, layout, feedback |
| `src/hooks/api/` | Hooks TanStack Query |
| `src/services/` | Chamadas HTTP |
| `src/mappers/` | DTO → Model |
| `src/contracts/` | Contratos alinhados ao backend |
| `src/types/` | Modelos de UI |
| `src/lib/` | API client, erros, auth storage, queryKeys |
| `docs/` | Arquitetura, Design System, Integração API |

---

## 4. Áreas da aplicação

| Área | Rotas | Dados |
| --- | --- | --- |
| Marketplace público | `/`, `/anuncios`, `/categorias`, `/lojas` | API |
| Auth | `/login`, `/cadastro` | API |
| Dashboard | `/painel/**` | API + AuthGuard |
| Compat | `/anunciar` | apenas redireciona (fluxo Anunciar) |

Sessão: `localStorage` (`clubepecas.auth.session`). Em **401** com token válido no cliente, o interceptor limpa a sessão e redireciona para `/login`.

---

## 5. Feedback UX (padrões)

| Estado | Componente / padrão |
| --- | --- |
| Loading de página / lista | Skeletons específicos (`*Skeleton`) |
| Erro de carga / submit | `ErrorMessage` + `getFriendlyErrorMessage` |
| Lista vazia | `EmptyState` |
| Sucesso / falha pontual | `toast` (Sonner) |
| Página não encontrada | `NotFound` |

---

## 6. Documentos relacionados

- [Design System](./design-system.md)
- [Integração API](./integracao-api.md)

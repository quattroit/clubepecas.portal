# Relatório — Refatoração GUID → INT

**Data:** 2026-07-20  
**Escopo:** Backend (`ClubePecas`) + Frontend (`CluebPecas.Portal`)

---

## Resumo executivo

Todos os identificadores internos de entidades foram migrados de `Guid` para `int` com auto incremento (PostgreSQL Identity). O banco anterior foi descartado, as 29 migrations antigas removidas e uma única migration inicial (`20260720131013_InitialCreate`) foi criada e aplicada.

Slugs permanecem como identificadores públicos — URLs não mudaram.

---

## Banco de dados

| Ação | Status |
|------|--------|
| Registros apagados | Sim (DB drop) |
| Banco excluído | `clubepecasdb` dropado |
| Migrations antigas | 59 arquivos removidos |
| Migration inicial | `20260720131013_InitialCreate` |
| PK strategy | `IdentityByDefaultColumn` (PostgreSQL) |
| `database update` | Aplicado com sucesso |

---

## Arquivos alterados

| Área | Quantidade |
|------|------------|
| Backend (Domain, Application, Infrastructure, Api, Tests) | ~232 |
| Frontend (contracts, types, services, hooks, features, app) | ~89 |
| **Total estimado** | **~321** |

---

## Entidades modificadas (15)

Todas com `int Id` gerado pelo banco:

- `User`
- `Seller`
- `Advertisement`
- `Photo`
- `Category`
- `City`
- `VehicleBrand`
- `VehicleModel`
- `SubscriptionPlan`
- `SellerSubscription`
- `PlatformSettings` (singleton `Id = 1` fixo no domínio)
- `AnalyticsEvent`
- `AuditLog`
- `NotificationCheckpoint`
- `PasswordResetToken`

**Auditoria:** `CreatedBy` / `UpdatedBy` → `int?`

---

## Controllers modificados

Rotas `{id:guid}` → `{id:int}` em:

- `AdminController`
- `AdminSubscriptionPlansController`
- `AdvertisementPhotosController`
- `AdvertisementsController`
- `SellersController`
- `SellerSubscriptionsController`
- Demais controllers com parâmetro de entidade

---

## Handlers / Application

Todos os vertical slices com IDs de entidade atualizados (~120+ handlers), incluindo:

- Requests / Responses / Validators
- `ICurrentUser.UserId` → `int?`
- `AuditEntry.UserId` / `SellerId` → `int?`
- Validações `Guid.Empty` → `<= 0` / `> 0`

---

## DTOs / Contratos frontend

- `id: string` → `id: number` em todos os DTOs de entidade
- FKs (`categoryId`, `sellerId`, `vehicleBrandId`, etc.) → `number`
- Arrays `orderedIds`, `photoIds` → `number[]`
- Novo utilitário `parseRouteId()` para params de rota dinâmica
- Helpers de rota: `editAdvertisementPath(id: number)`, etc.

**Slugs inalterados** (`string`).

---

## Páginas / componentes frontend (principais)

- Painel: editar anúncio, fotos, upload queue
- Admin: detalhe vendedor/anúncio, CRUD categorias/cidades/marcas/modelos/planos
- Marketplace: filtros (IDs numéricos na API)
- Auth: sessão com `userId: number`

---

## Validação

| Check | Resultado |
|-------|-----------|
| Backend build | 0 erros |
| Testes backend | 39/39 aprovados |
| Frontend `tsc --noEmit` | 0 erros |
| Domain sem `Guid` | Confirmado |
| Controllers sem `:guid` | Confirmado |
| Seeds sem `Guid.NewGuid()` para PK | Confirmado |

---

## Ocorrências remanescentes de `Guid`

| Local | Motivo |
|-------|--------|
| `StorageKeyFactory.cs` | Nomes únicos de arquivos no storage — não é ID de entidade |
| `FileIntegrityAndCleanupTests.cs` | Nome único de banco InMemory por teste |
| `LocalFileStorageTests.cs` | Diretório temporário de teste |
| `ResendEmailService.cs` | Tipo genérico `ResendResponse<Guid>` da SDK Resend (ID externo de e-mail) |

**Tokens JWT:** claim `sub` agora contém o `int` do usuário como string (`user.Id.ToString()`).

**Password reset:** PK da entidade é `int`; o token bruto é gerado via `RandomNumberGenerator` (não é Guid de entidade).

---

## O que NÃO foi alterado

- Arquitetura (Clean + Vertical Slice)
- Regras de negócio
- Endpoints (paths iguais; slugs públicos iguais)
- Autenticação / autorização (JWT, roles)
- Layout e UX do frontend
- Documentação existente (exceto este relatório)

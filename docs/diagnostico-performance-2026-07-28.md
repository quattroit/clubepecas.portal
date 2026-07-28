# Diagnóstico de Performance — ClubePeças

**Data:** 2026-07-28  
**Escopo:** Backend (.NET 9 / EF Core / PostgreSQL), Frontend (Next.js / React Query), Docker, Nginx  
**Método:** análise estática de código e configuração (sem benchmarks de runtime, sem alterações de código)  
**Repos:** `ClubePecas` (API) + `ClubePecas.Portal` (web)

---

## 1. Resumo executivo

O maior impacto hoje não está em “falta de AsNoTracking” (a maioria das leituras já usa), e sim em:

1. **Cascata N+1 no frontend** para montar a lista de lojas (`loadPublicStores`).
2. **Overfetch / ausência de endpoint de listagem de lojas** no backend público.
3. **Subconsultas correlacionadas de analytics** em listagens admin.
4. **Assets estáticos pesados** (hero ~1,5 MB, logo ~1 MB).
5. **Dashboards admin/financeiro** com muitas idas ao banco e materialização ampla.
6. **Busca de marketplace não-sargável** (`ToLower().Contains`) sem full-text/trigram.
7. **Nginx/API sem cache** em rotas públicas quentes; `proxy_buffering off` na API.

Estimativa qualitativa (não medida): corrigir o P0 de lojas + assets + paginação/SSR da home pode reduzir **latência percebida da home em 50–80%** e o número de requests HTTP da home de **dezenas** para **poucos**.

---

## 2. Endpoints mais lentos (estimativa por padrão de código)

Ordenados pelo risco de latência sob carga / crescimento de dados. Sem APM; classificação por complexidade observada.

| Prioridade | Endpoint | Handler / serviço | Por quê |
|---|---|---|---|
| P0 | `GET /api/v1/marketplace` (efeito cascata via FE) | `GetMarketplace` + N× `GET ads/{slug}` + M× `GET public/sellers/{slug}` | FE multiplica o custo; perfil público devolve **todos** os anúncios da loja |
| P0 | `GET .../public/sellers/{slug}` | `GetSellerPublicProfile` | Lista ilimitada de anúncios publicados embutida no payload |
| P0 | `GET .../admin/sellers` | `ListAdminSellers` | `Count`/`LongCount` correlacionados em `Advertisements` e `AnalyticsEvents` por linha + `CountAsync` no mesmo `Select` |
| P0 | `GET .../admin/advertisements` | `ListAdminAdvertisements` | Mesmo padrão de views/clicks correlacionados; pior se ordenar por views |
| P0 | `GET .../admin/financial/dashboard` | `FinancialDashboardService` | Carrega **todas** as assinaturas em memória e agrega no app |
| P1 | `GET .../admin/analytics` | `GetAdminAnalytics` | ~40 `await` sequenciais; sem cache |
| P1 | `GET .../admin/dashboard` | `GetAdminDashboard` | ~28 `await` sequenciais + fan-out de atividade recente |
| P1 | `GET /api/v1/marketplace` (isolado) | `GetMarketplace` | Hot path público; busca `ToLower().Contains`; joins Seller/City/Category; subconsulta de thumbnail; `Take(20)` sem Skip |
| P1 | `GET .../sellers/me/metrics` | `GetSellerDashboardMetrics` | Múltiplas agregações + materialização parcial em memória |
| P1 | Part-request suppliers / create flow | `PartRequestSupplierDiscovery` | Scan de ads compatíveis + Include Seller/City/User |
| P2 | `GET .../home/stats` | `GetHomeStats` | 3 `CountAsync` sequenciais, sem cache (cache FE 5 min mitiga) |
| P2 | `GET .../advertisements/me` | `GetMyAdvertisements` | Sem paginação; cresce com inventário do seller |
| P2 | Seller payments / subscriptions lists | handlers seller | Histórico ilimitado |

**Nota importante:** `GetMarketplace` já faz `Take(20)` (`MaxItems = 20`). O frontend trata como “lista completa sem paginação real” (`totalPages: 1`) e ainda assim dispara pipelines extras (lojas / relacionados).

---

## 3. Consultas EF Core ineficientes

### 3.1 Alto — subconsultas correlacionadas (admin)

`ListAdminSellers` projeta por seller:

- `AdvertisementCount = _dbContext.Advertisements.Count(...)`
- `Views = _dbContext.AnalyticsEvents.LongCount(...)`
- `WhatsappClicks = _dbContext.AnalyticsEvents.LongCount(...)`

O `CountAsync` da página e o `Skip/Take` rodam sobre a mesma projeção → SQL caro (N subqueries × páginas).  
Arquivo: `ClubePecas.Application/Features/Admin/ListAdminSellers/Handler.cs`  
Padrão similar em `ListAdminAdvertisements`.

**Mitigação sugerida (futura):** pré-agregar analytics em tabela/materialized view ou `GroupBy` + join; não correlacionar no `Select` da listagem.

### 3.2 Alto — materialização completa (financeiro)

`FinancialDashboardService.GetDashboardAsync` faz `.ToListAsync()` de todas as `SellerSubscriptions` (com campos de payment/plan) e agrega MRR/status/churn em memória.

Arquivo: `ClubePecas.Application/Services/Financial/FinancialDashboardService.cs`

### 3.3 Alto — busca não-sargável (marketplace)

```csharp
advertisement.Title.ToLower().Contains(term)
// + Description + CompatibilityDescription
```

Traduz para expressão tipo `LOWER(col) LIKE '%term%'` → seq scan.  
Arquivo: `Features/Marketplace/GetMarketplace/Handler.cs`

### 3.4 Médio — Includes / entidades completas

| Local | Problema |
|---|---|
| `PartRequestSupplierDiscovery` | 3 roundtrips; `Include(City).Include(User)` carrega entidades inteiras para poucos campos |
| `ListPartRequests` / `GetMyPartRequests` | Includes de Brand/Model/Category/City/WinningSeller + DTO via entidade; múltiplos counts de summary |
| `ListSellerSubscriptions` | Include de Plan.Prices + CurrentPayment (coleção pode inflar) |

`AsSplitQuery` **não aparece** no código-fonte.

### 3.5 Médio — chatty dashboards

- `GetAdminAnalytics`: ~40 awaits  
- `GetAdminDashboard`: ~28 awaits  
- `GetHomeStats`: 3 counts sequenciais (DbContext não thread-safe — correto, mas sem cache server-side)

### 3.6 Baixo — AsNoTracking / tracking global

- Leituras públicas/admin relevantes **já usam** `AsNoTracking`.
- `AddDbContext` sem `UseQueryTrackingBehavior(NoTracking)` e sem `AddDbContextPool` → risco residual se algum read esquecer tracking; pooling ausente.

### 3.7 Positivos

- Marketplace e perfil público usam projeções `Select`.
- Sem lazy-loading proxies detectados.
- PartRequest / AnalyticsEvent têm índices compostos razoáveis.

---

## 4. Índices PostgreSQL — ausentes ou inadequados

### Presentes (bom)

- `Advertisements`: SellerId, Status, Slug, CreatedAt, CategoryId, VehicleBrandId, VehicleModelId, years  
- `AnalyticsEvents`: OccurredAt, (EventType, ListingId, OccurredAt), (SellerId, EventType, OccurredAt), etc.  
- `PartRequests`: buyer+status, buyer+outcome, FKs, CreatedAt  

### Lacunas relevantes

| Severidade | Lacuna | Impacto |
|---|---|---|
| Alta | Sem composto `(Status, CreatedAt)` ou `(Status, SellerId, CreatedAt)` em `Advertisements` | Hot path: Published + OrderBy CreatedAtDesc (marketplace, loja, home counts) |
| Alta | Sem índice em `Advertisements.Price` | Sort `price-asc` / `price-desc` |
| Alta | Sem full-text / `pg_trgm` em Title/Description | Busca `Contains` nunca usa B-tree |
| Média | Filtro soft-delete (`IsDeleted`) sem suporte composto com Status | Quase toda query de ads |
| Média | `Users.LastLoginAt` sem índice | Contagens “online” no admin |
| Média | `Sellers.CreatedAt` / `UpdatedAt` sem índice dedicado | Listagens/atividade recente |
| Baixa | Muitos índices single-column de baixa seletividade (anos) | Custo de escrita |

**Infra Postgres no Compose:** imagem `postgres:16-alpine` sem tuning (`shared_buffers`, `work_mem`, etc.) e sem PgBouncer. Adequado para início; limitado sob concorrência.

---

## 5. Frontend — requisições duplicadas / em cascata

### 5.1 P0 — `loadPublicStores` (N+1)

Arquivo: `src/lib/loadPublicStores.ts`

Fluxo:

1. `GET /marketplace` (até 20 itens)
2. Para cada grupo de loja: `GET advertisement by slug` (N)
3. Para cada slug único: `GET public seller by slug` (M) — **cada um traz todos os anúncios da loja**

Usado em: home (`useStores`), `/lojas`, e `generateStaticParams` via `loadPublicStoreSlugs()` (amplifica no build).

**Home** ainda chama em paralelo `useAdvertisements` → **segundo** `GET /marketplace`, depois `slice(0, 6)` e `slice(0, 4)`.

### 5.2 P0 — detalhe do anúncio

`useAdvertisement`:

- `getBySlug` + `getMarketplace()` completo só para 4 relacionados  
- Metadata SSR já busca o slug; client **refetch** o mesmo detalhe (sem hydration)

### 5.3 P1 — waterfalls

- `useCategory`: ads só após categories  
- Part-request detail → suppliers  
- Auth hydration (`localStorage`) → só então queries seller/subscription  
- Dual mount de filtros (desktop + mobile) pode duplicar `useVehicleModels`

### 5.4 P2 — platform settings

SSR (layout/footer metadata) + client (`usePlatformSettings` / header) na mesma navegação.

---

## 6. Componentes / renderizações desnecessárias

| Achado | Severidade | Evidência |
|---|---|---|
| Superfície `"use client"` alta (~280+ módulos); páginas públicas só shell SSR | Alta | `page.tsx` → views client sem prefetch |
| Sem virtualização em grids de anúncios/lojas | Alta | `AdvertisementGrid` / `SellerGrid` mapeiam cards pesados |
| Sem `React.memo` em cards de lista | Média | Re-render em mudanças de filtro/parent |
| `Providers` globais (Theme + Query + Auth + Representative + Referral) | Média | ReferralProvider também toca `useSeller` para sellers em rotas públicas |
| FilterSidebar duplicado (desktop + sheet mobile) | Média | Dois consumers de models |
| Seções estáticas da home dentro de client view | Baixa | Poderiam ser RSC |

---

## 7. React Query — configurações

Arquivo: `src/lib/query-client.ts`

| Opção | Valor | Avaliação |
|---|---|---|
| `staleTime` | 60s | Adequado |
| `gcTime` | 10 min | Adequado |
| `refetchOnWindowFocus` | false | Bom para perf |
| `retry` | 1 | Adequado |

**Problemas (não são os defaults globais):**

- Sem `prefetchQuery` / `HydrationBoundary` / `dehydrate` nas páginas públicas → waterfall pós-paint.
- `placeholderData` só em hooks admin; marketplace/seller flasham loading em troca de filtro.
- Keys com `page` embora API não pagine de verdade → fragmentação de cache.
- `useAdvertisements` inventa `totalPages: 1` e baixa o cap do backend como se fosse o inventário completo.
- Catálogos (categories/cities/brands) com `staleTime` 60s redundante; home stats / settings 5 min — bom.

---

## 8. APIs retornando mais dados do que o necessário

| Resposta | Overfetch |
|---|---|
| `GetSellerPublicProfile` | Array completo de anúncios; FE da listagem usa sobretudo `length` / poucos campos do card |
| Marketplace list → card | Mapper preenche brand/model ids/slugs, cityId, etc.; card usa subset |
| `GetMyAdvertisements` | Inventário completo sem página |
| Admin lists | Largo (aceitável), mas analytics por linha multiplica custo DB |
| Related ads (FE) | Marketplace inteiro (20) para 4 itens |
| Categories DTO | description, displayOrder, iconType pouco usados no card da home |
| PartRequest list DTO | Campos ricos (description, closing notes, etc.) vs card de lista |

**Gap de produto/API:** não existe `GET /public/sellers` (listagem leve). O FE compensa com cascata cara.

---

## 9. Docker & Nginx

### Docker Compose (`ClubePecas/docker-compose.yml`)

| Achado | Severidade | Nota |
|---|---|---|
| Sem `deploy.resources` / limites de CPU-RAM | Média | Contenção silenciosa no host |
| Postgres sem parâmetros de performance | Média | Defaults Alpine |
| Sem PgBouncer / pooler | Média | Conexões sob pico |
| Single replica backend/frontend | Esperado | Sem HA; OK para estágio atual |
| Connection string sem `Maximum Pool Size` explícito | Baixa | Relia em defaults Npgsql |
| Frontend standalone Next | Positivo | Imagem enxuta |
| Backend multi-stage publish | Positivo | Bom |

### Nginx (`docker/nginx/nginx.conf` + `conf.d/http.conf`)

| Achado | Severidade | Nota |
|---|---|---|
| **Sem `proxy_cache`** em `/api/` | Alta | Home stats, marketplace, catalogs reprocessam sempre |
| **`proxy_buffering off`** em `/api/` | Alta | Pior throughput/latência para JSON; útil só se streaming |
| Sem `limit_req` / rate limit | Média | Abuso e picos |
| Gzip on (nível 5) | Positivo | Sem brotli |
| Cache `expires 365d` em `/_next/static/` | Positivo | |
| Cache 7d em `/uploads/` | Positivo | Mídia local |
| DNS re-resolve com variável | Positivo | Evita 502 pós-recreate |
| `proxy_read_timeout 300s` | Neutro | Uploads longos; mantém conexões abertas |
| `client_max_body_size 15m` | Neutro | Alinhado a uploads |

### Assets estáticos (Portal)

| Arquivo | Tamanho |
|---|---|
| `public/images/brand/fundo.png` | **~1486 KB** (hero `priority`) |
| `public/images/brand/logo.png` | **~1035 KB** |
| `RemoteImage` | `<img>` nativo — sem otimização Next/CDN resize |

---

## 10. Outros gargalos

1. **Ausência total de cache distribuído / OutputCache** no backend (só `IMemoryCache` em platform settings).  
2. Soft-delete query filters com navegações (`Seller.User!.IsDeleted`, etc.) injetam joins em muitas queries.  
3. Busca admin por e-mail materializa usuários/buyers em memória (workaround de VO/converter).  
4. `generateStaticParams` de lojas chama o pipeline N+1 completo.  
5. Sem observabilidade de performance (APM, slow query log, OpenTelemetry spans) no escopo analisado — dificulta priorizar com dados reais.

---

## 11. Relatório priorizado (impacto ↓ × dificuldade)

Escala de ganho: **Alto / Médio / Baixo** (latência, RPS, bytes, ou requests HTTP).  
Dificuldade: **Baixa / Média / Alta**.

| # | Item | Camada | Ganho esperado | Dificuldade | Notas |
|---|---|---|---|---|---|
| 1 | Endpoint `GET /public/sellers` (lista leve: slug, nome, cidade, foto, count) e **eliminar** `loadPublicStores` N+1 | BE + FE | **Muito alto** (home/lojas: dezenas de HTTP → 1) | Média | Maior ROI do projeto |
| 2 | Perfil público: paginar ads; listagem de lojas **sem** embutir `advertisements[]` | BE + FE | Alto | Baixa–Média | Overfetch direto |
| 3 | Comprimir/converter hero + logo (WebP/AVIF, ≤100–200 KB) | FE | Alto (LCP) | Baixa | `fundo.png` 1,5 MB; `logo.png` 1 MB |
| 4 | Admin sellers/ads: agregar analytics fora do `Select` correlacionado | BE | Alto (admin sob crescimento de eventos) | Média–Alta | Tabela diária ou GroupJoin |
| 5 | SSR/prefetch + HydrationBoundary na home e `/anuncios` | FE | Alto (TTFB/LCP) | Média | Reusar fetches de metadata |
| 6 | Paginação real no marketplace (`Skip/Take` + total) e FE consumindo | BE + FE | Alto (escala de catálogo) | Média | Hoje só `Take(20)` |
| 7 | Índice composto `(Status, CreatedAt)` (+ Price) em Advertisements | PG | Médio–Alto | Baixa | Migration simples |
| 8 | Full-text ou `pg_trgm` + `EF.Functions.ILike` / tsquery | PG + BE | Alto em busca com `q` | Média | Substitui `ToLower().Contains` |
| 9 | Cache curto (Memory/OutputCache/Nginx) em home stats, categories, brands, cities | BE / Nginx | Médio–Alto | Baixa–Média | Dados quase estáticos |
| 10 | Financial dashboard: agregações SQL em vez de `ToList` total | BE | Alto (crescimento de assinaturas) | Média | |
| 11 | `useAdvertisement`: endpoint/related ou reutilizar cache marketplace; não refetch duplicado | FE | Médio | Baixa | |
| 12 | `next/image` (ou CDN resize) para mídia de anúncios | FE | Médio (bytes/LCP cards) | Média | Hoje `RemoteImage` = `<img>` |
| 13 | Virtualização nas grids longas + memo nos cards | FE | Médio (TBT/scroll) | Média | |
| 14 | Admin analytics/dashboard: consolidar queries / cache 30–60s | BE | Médio | Média | ~28–40 awaits |
| 15 | Nginx: `proxy_buffering on` + `proxy_cache` seletivo em GETs públicos | Nginx | Médio | Baixa | Cuidado com auth |
| 16 | `GetMyAdvertisements` + payments/subscriptions: paginar | BE + FE | Médio (sellers grandes) | Baixa–Média | |
| 17 | `PartRequestSupplierDiscovery`: projeções + aggregate SQL | BE | Médio | Média | |
| 18 | DbContext: `NoTracking` default + `AddDbContextPool` | BE | Baixo–Médio | Baixa | |
| 19 | `placeholderData` em listagens marketplace/seller | FE | Baixo–Médio (UX/perceived) | Baixa | |
| 20 | Postgres tuning / PgBouncer no Compose | Infra | Médio sob carga | Média | |
| 21 | Reduzir surface client / evitar barrel pesado na home | FE | Baixo–Médio | Média | |
| 22 | Rate limit Nginx + observabilidade (slow queries, APM) | Infra | Indireto | Baixa–Média | Habilita priorização com dados |

---

## 12. Mapa rápido por jornada

### Home `/`

Hoje (ordem de grandeza): marketplace ×2 + N ads-by-slug + M seller profiles (com ads) + categories + home stats + platform settings + hero 1,5 MB.

Alvo: 1 marketplace (ou SSR), 1 listagem de lojas leve, stats/settings cacheados, assets leves.

### `/lojas`

Mesma cascata N+1; filtro client-side após baixar perfis pesados.

### `/anuncios/[slug]`

Metadata server + client detail + marketplace inteiro para relacionados.

### Admin sellers/ads/analytics/financeiro

Custo cresce com `AnalyticsEvents` e histórico de assinaturas; padrões correlacionados e full-scan em memória.

---

## 13. O que **não** é o problema principal

- Defaults do React Query (60s / sem refetch on focus) — saudáveis.  
- Falta generalizada de `AsNoTracking` em reads públicos — já aplicados.  
- Lazy loading EF — não habilitado.  
- Indexação básica de FKs — em geral presente.  
- Dockerfile multi-stage / Next standalone / cache de `/_next/static` — adequados.

---

## 14. Próximo passo recomendado (sem implementar nesta etapa)

1. Medir com APM ou logs de duração nos endpoints da tabela da seção 2 (baseline).  
2. Implementar item **#1 + #2 + #3** da seção 11 (maior ganho / esforço moderado).  
3. Em paralelo, migration de índices **#7** (baixo risco).  
4. Só então atacar admin analytics correlacionado e full-text.

---

*Documento gerado apenas para diagnóstico. Nenhuma otimização foi aplicada ao código nesta etapa.*

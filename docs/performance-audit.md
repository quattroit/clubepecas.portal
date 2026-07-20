# Auditoria de Performance — Sprint 7.1

**Data:** 2026-07-17  
**Escopo:** Backend (`ClubePecas`) + Frontend (`CluebPecas.Portal`)  
**Premissa:** melhorias transparentes, sem alteração de regras de negócio nem breaking changes em contratos públicos.

---

## Resumo executivo

A sprint focou em gargalos de alto ROI e baixo risco: projeções EF Core, cache em memória de `PlatformSettings`, redução de cópias no upload, índice de analytics por `SellerId`, eliminação do N+1 de fotos em “Meus anúncios”, política de React Query mais eficiente e code-splitting de telas admin pesadas.

Resultado esperado: menos round-trips ao banco, menos memória em upload, menos refetch no client e payloads de listagem mais enxutos — sem mudar o comportamento funcional para o usuário.

---

## Melhorias implementadas nesta sprint

### Backend

| Item | Antes | Depois | Impacto estimado |
|------|-------|--------|------------------|
| Detalhe público / painel (`GetAdvertisement*`) | `Include` + entidade completa | `AsNoTracking` + `Select` | −40–70% I/O por request |
| `GetMyAdvertisements` | seller tracked + sem thumbnail | seller Id + `ThumbnailUrl` embutida | elimina N+1 no FE |
| `GetPhotos` | carrega anúncio completo | `AnyAsync` + fotos `AsNoTracking` | 1 query a menos |
| `TrackEvent` | entidade completa | projeção Id/SellerId | payload SQL menor |
| `ListAdminAuditLogs` | entidade + `MetadataJson` | projeção dos campos da resposta | −payload DB |
| `PlatformSettings` | 2 queries a cada leitura | `IMemoryCache` 10 min + invalidação no update | −latência em uploads/settings |
| Upload imagem | buffer assinatura + cópia no processor | `ProcessAsync(byte[])` sem cópia extra | −1 buffer por upload |
| Logs hot path (storage/imaging/upload/audit) | `LogInformation` | `LogDebug` | menos I/O de log em produção |
| Analytics `SellerId` | sem índice dedicado | índice `(SellerId, EventType, OccurredAt)` — migration `029` | dashboards/admin sellers mais rápidos |
| Includes redundantes em listagens de modelos | `Include` + `Select` | só `Select` | SQL mais enxuto |

Campos **aditivos** (compatíveis): `ThumbnailUrl` em “me”; `ThumbnailUrl` em fotos do detalhe por slug.

### Frontend

| Item | Antes | Depois | Impacto estimado |
|------|-------|--------|------------------|
| `useMyAdvertisements` | N+1 `GET .../photos` | 1 request com `thumbnailUrl` | −N requests (crítico) |
| `useAdvertisement` | waterfall slug → marketplace | `Promise.all` | −latência de detalhe |
| `refetchOnMount: "always"` | vários hooks quentes | removido (usa staleTime 60s) | menos refetch ao navegar |
| QueryClient | sem `gcTime` explícito | `gcTime: 10 min` | menos GC agressivo |
| Login/Register | invalidate + AuthQuerySync | só AuthQuerySync | −1 invalidação duplicada |
| Galeria de detalhe | full URL nas thumbs | `thumbnailUrl` na faixa | menos bytes de imagem |
| Admin Analytics / Arquivos | import estático | `next/dynamic` | menor JS inicial dessas rotas |
| Header / admin home | barrel import | deep import | bundle mais previsível |
| Invalidação dashboard admin | só período `"all"` | prefixo `["admin","dashboard"]` | cache coerente |

---

## Problemas encontrados (não corrigidos agora)

| Problema | Severidade | Onde | Motivo de adiamento |
|----------|------------|------|---------------------|
| Listagens admin com métricas correlacionadas (`ListAdminSellers` / `ListAdminAdvertisements`) | Alta | Backend | exige rewrite de agregações SQL |
| Busca `ToLower().Contains` / ILIKE sem `pg_trgm` | Média | Marketplace / admin | migration + tuning Postgres |
| `GetMyAdvertisements` / perfil público sem paginação | Média | Backend + FE | mudança de contrato/UX |
| Endpoint dedicado de anúncios relacionados | Média | Detalhe público | ainda usa marketplace completo |
| Home: overfetch (lista completa + `slice`) | Média | FE + API `limit` | precisa parâmetro na API |
| Cache em memória de catálogos (categorias/marcas/cidades) | Baixa–Média | Backend | seguro, mas precisa invalidação nos writes admin |
| `GetHomeStats` / dashboards com vários `CountAsync` sequenciais | Média | Backend | DbContext não é thread-safe; SQL único |
| SSR dehydrate de `platform-settings` | Baixa | FE layout | evita double-fetch SSR+client |
| Split de views admin monolíticas (~500+ linhas) | Baixa | FE | manutenção, não urgência de perf |
| Soft-delete / `(Status, CreatedAt)` index em Advertisements | Baixa–Média | Postgres | validar com `EXPLAIN` em produção |

---

## Melhorias adiadas (Sprint 7.2+)

### Prioridade P0 / P1

1. **Agregações admin em SQL** — pré-agregar analytics/listing counts; `Count` na query base, métricas só da página.
2. **`GET /advertisements/{slug}/related?limit=4`** — retirar marketplace full do detalhe.
3. **Paginação / `limit` em “me”, perfil público e home.**
4. **`pg_trgm` (ou FTS)** para busca por título/descrição.

### Prioridade P2

5. Cache em memória de Categories / Cities / Brands / Models com invalidação nos handlers admin.
6. Dehydrate React Query no layout SSR para platform settings.
7. `dynamic()` em mais telas admin (vendedores, anúncios, planos).
8. Revisar DTOs de `GetPhotos` (não expor `StorageKey`/`Checksum` ao client se não usados).

### Prioridade P3

9. Memoização pontual de cards após profiling.
10. Índice composto `(Status, CreatedAt)` em Advertisements após medir.

---

## Estimativa de impacto (qualitativa)

| Área | Antes → Depois (ordem de grandeza) |
|------|-------------------------------------|
| Painel “Meus anúncios” (10 ads) | ~11 HTTP → **1 HTTP** |
| Detalhe anúncio (TTFB percibido) | waterfall 2 requests → **paralelo** |
| Upload foto (memória pico) | ~3–4× arquivo → **~2–3×** (1 cópia a menos) |
| Leituras PlatformSettings | 2 SQL / chamada → **0 SQL** (cache hit) |
| Admin analytics JS | no initial chunk da rota → **lazy** |

Benchmarks formais não foram executados nesta sprint (conforme escopo: sem suíte de load test).

---

## Sugestões para Sprint 7.2

1. Endpoint de relacionados + `limit` na home/marketplace.
2. Reescrever listagens admin com métricas (sellers/ads) sem subqueries correlacionadas por linha.
3. Índice/trgm + revisar planos de execução das buscas.
4. Cache de catálogos estáticos + política unificada de invalidação.
5. Paginação consistente em todos os endpoints que ainda retornam lista completa.
6. Observabilidade leve: tempos médios dos endpoints quentes (sem APM completo).

---

## Checklist de validação Sprint 7.1

- [x] Backend compila
- [x] Frontend typecheck
- [x] Testes existentes executados
- [x] Migration `029_AnalyticsEventsSellerIdIndex` criada/aplicada
- [x] Sem Redis / CDN / jobs / mudança arquitetural

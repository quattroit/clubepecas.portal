# Medição de Performance — Antes × Depois

**Data:** 2026-07-28  
**Ambiente:** API local `https://localhost:7000`, PostgreSQL local, 3 lojas com anúncios publicados no dataset  
**Método:** `curl` com 3–5 runs após warmup (média aritmética)

## O que foi implementado

1. **`GET /api/v1/sellers`** — listagem leve (sem anúncios embutidos), 1 query EF com join agregado
2. **Frontend** — `loadPublicStores` deixou de fazer cascata marketplace → N× ad → M× perfil
3. **Índices** — `IX_Advertisements_Status_CreatedAt`, `IX_Advertisements_SellerId_Status_CreatedAt`, `IX_Advertisements_Price`
4. **Assets** — `fundo.webp` / `logo.webp` no lugar dos PNGs pesados
5. **Detalhe de anúncio** — relacionados via marketplace filtrado por categoria (não lista “genérica” paralela sem filtro)

---

## 1) Listagem de lojas (`loadPublicStores` / `/lojas` / home stores)

| Métrica | Antes | Depois | Variação |
|---|---|---|---|
| **Tempo médio** | **320 ms** | **31,8 ms** | **−90%** |
| **Requisições HTTP** | **7** | **1** | **−86%** |
| **Payload** | **15 165 B** (~14,8 KB) | **1 131 B** (~1,1 KB) | **−93%** |
| **Queries EF (estimadas)** | **~13** | **~1** | **−92%** |

**Antes:** `GET /marketplace` + 3× `GET /advertisements/{slug}` + 3× `GET /sellers/{slug}` (perfil com ads embutidos)  
**Depois:** `GET /sellers` (items leves + `advertisementCount`)

---

## 2) Home (anúncios recentes + lojas em destaque)

| Métrica | Antes (est.) | Depois | Variação |
|---|---|---|---|
| **Tempo médio** | **~542 ms** | **77,2 ms** | **−86%** |
| **Requisições HTTP** | **8** | **2** | **−75%** |
| **Payload** | **~20 131 B** | **6 097 B** | **−70%** |
| **Queries EF (estimadas)** | **~14** | **~2** | **−86%** |

**Antes:** `useAdvertisements` (marketplace) + cascata completa de lojas (marketplace de novo)  
**Depois:** `GET /marketplace` + `GET /sellers`

---

## 3) Assets estáticos (LCP / hero)

| Arquivo | Antes | Depois | Variação |
|---|---|---|---|
| Hero (`fundo`) | **1 521 784 B** (PNG) | **33 854 B** (WebP) | **−97,8%** |
| Logo | **1 060 203 B** (PNG) | **18 802 B** (WebP) | **−98,2%** |
| **Total** | **~2,46 MB** | **~51 KB** | **−98%** |

---

## Arquivos de medição bruta

- `docs/perf-baseline-before.json`
- `docs/perf-baseline-after.json`

## Observações

- Dataset pequeno (3 lojas no marketplace). O ganho relativo **aumenta** com mais lojas (cascata era O(N+M)).
- Queries “antes” estimadas pelo padrão de handlers (1 marketplace + ~2 por ad detail + ~2 por perfil). Queries “depois” = 1 SQL com join agregado no handler `ListPublicSellers`.
- Listagem pública agora retorna só lojas ativas com ≥1 anúncio publicado, ordenadas por contagem desc.

# ClubePeças — Design System (MVP)

Documento oficial de referência visual do Frontend.  
Todas as telas devem seguir estes padrões. Não inventar cores, tipografia ou componentes fora deste guia.

---

## 1. Princípios

| Princípio    | Significado                                              |
| ------------ | -------------------------------------------------------- |
| Confiança    | Visual limpo, estável, sem ruído                         |
| Organização  | Hierarquia tipográfica clara e espaçamento consistente   |
| Rapidez      | Componentes leves e feedback visual direto               |
| Simplicidade | Poucos tokens, poucas variantes, sem decoração excessiva |

Público: oficinas, autopeças, mecânicos e compradores de peças.

Evitar: visual corporativo pesado, excesso de cor, efeitos de glow, pills exagerados.

---

## 2. Paleta oficial

Fonte da verdade: `src/styles/globals.css` (CSS variables).  
**Nenhuma cor hardcoded em componentes ou páginas.**

| Token                                   | Uso                             | Referência aproximada |
| --------------------------------------- | ------------------------------- | --------------------- |
| **Primary**                             | CTAs, links, foco               | Aço azulado `#24627F` |
| **Secondary**                           | Fundos sutis, ações secundárias | Cinza frio `#E6EEF2`  |
| **Success**                             | Confirmações, status positivo   | Verde `#2F6F4E`       |
| **Warning**                             | Alertas não bloqueantes         | Âmbar `#B87A1A`       |
| **Danger / Destructive**                | Erros e ações destrutivas       | Vermelho `#B42318`    |
| **Background**                          | Fundo da página                 | `#F4F7F9`             |
| **Surface / Card**                      | Painéis, cards                  | `#FFFFFF`             |
| **Border**                              | Divisores e contornos           | `#D5DEE5`             |
| **Text Primary** (`foreground`)         | Títulos e texto principal       | `#1A2332`             |
| **Text Secondary** (`muted-foreground`) | Apoio, labels secundários       | `#5C6B7A`             |

### Classes Tailwind equivalentes

```txt
bg-primary / text-primary-foreground
bg-secondary / text-secondary-foreground
bg-success / text-success
bg-warning / text-warning-foreground
bg-destructive / text-destructive-foreground
bg-background / text-foreground
bg-surface / bg-card
border-border
text-muted-foreground
```

---

## 3. Tipografia

**Fonte oficial:** [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) via `next/font` (`src/app/layout.tsx`).

Pesos utilizados: `400`, `500`, `600`, `700`.

### Escala tipográfica

| Token   | Classe         | Tamanho  | Peso | Uso                 |
| ------- | -------------- | -------- | ---- | ------------------- |
| Display | `text-display` | 2.5rem   | 600  | Hero / marca (raro) |
| H1      | `text-h1`      | 2rem     | 600  | Título de página    |
| H2      | `text-h2`      | 1.5rem   | 600  | Seção               |
| H3      | `text-h3`      | 1.25rem  | 500  | Subseção / card     |
| Body    | `text-body`    | 1rem     | 400  | Texto corrido       |
| Small   | `text-small`   | 0.875rem | 400  | Apoio, captions     |

Exemplo:

```tsx
<h1 className="text-h1">Título da página</h1>
<p className="text-body">Conteúdo principal.</p>
<span className="text-small">Texto auxiliar</span>
```

---

## 4. Espaçamentos

Usar a escala padrão do Tailwind (base 4px):

| Token | Valor | Uso típico             |
| ----- | ----- | ---------------------- |
| `1`   | 4px   | Micro gaps             |
| `2`   | 8px   | Entre ícone e label    |
| `3`   | 12px  | Grupos compactos       |
| `4`   | 16px  | Padding interno padrão |
| `6`   | 24px  | Entre blocos           |
| `8`   | 32px  | Entre seções           |
| `12`  | 48px  | Separação maior        |
| `16`  | 64px  | Respiro de página      |

Preferir `gap-*` e `p-*` / `space-y-*` em vez de margens soltas sem sistema.

---

## 5. Border Radius

| Token           | Valor          |
| --------------- | -------------- |
| Base `--radius` | `0.5rem` (8px) |
| `rounded-sm`    | ~4.8px         |
| `rounded-md`    | ~6.4px         |
| `rounded-lg`    | 8px            |
| `rounded-xl`    | ~11px          |

Componentes de UI usam `rounded-lg` / `rounded-md` por padrão.

---

## 6. Sombras

| Token | Classe      | Uso                           |
| ----- | ----------- | ----------------------------- |
| XS    | `shadow-xs` | Botões, inputs elevados leves |
| SM    | `shadow-sm` | Cards discretos               |
| MD    | `shadow-md` | Dropdowns / overlays leves    |
| LG    | `shadow-lg` | Modais (futuro)               |

Sombras são sutis — sem glow colorido.

---

## 7. Componentes existentes

Todos em `src/components/ui/`. Sem regra de negócio.

| Componente     | Arquivo           | Variantes / notas                                                                               |
| -------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| **Button**     | `button.tsx`      | `primary` (ou `default`), `secondary`, `outline`, `ghost`, `destructive`                        |
| **Input**      | `input.tsx`       | Campo de texto padrão                                                                           |
| **Textarea**   | `textarea.tsx`    | Texto multilinha                                                                                |
| **Label**      | `label.tsx`       | Rótulo de formulário                                                                            |
| **Card**       | `card.tsx`        | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `CardAction` |
| **Badge**      | `badge.tsx`       | `default`, `secondary`, `success`, `warning`, `destructive`, `outline`, `ghost`                 |
| **Separator**  | `separator.tsx`   | Horizontal / vertical                                                                           |
| **Skeleton**   | `skeleton.tsx`    | Placeholder de loading                                                                          |
| **EmptyState** | `empty-state.tsx` | `title`, `description?`, `icon?`, `action?`                                                     |

### Importação

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
```

### Button — exemplos

```tsx
<Button variant="primary">Salvar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="outline">Filtrar</Button>
<Button variant="ghost">Limpar</Button>
<Button variant="destructive">Excluir</Button>
```

### EmptyState — exemplo

```tsx
<EmptyState
  title="Nenhum resultado"
  description="Ajuste os filtros e tente novamente."
/>
```

---

## 8. Convenções

1. **Cores:** apenas tokens CSS / classes Tailwind do Design System.
2. **Tipografia:** usar as classes oficiais (`text-h1`, `text-body`, etc.).
3. **Componentes de negócio:** ficam em `src/features/<feature>/`, não em `ui/`.
4. **ui/**: somente blocos reutilizáveis e sem domínio.
5. **Nomenclatura:** PascalCase nos arquivos de componente (`EmptyState.tsx` → arquivo `empty-state.tsx` no padrão shadcn).
6. **Formulários:** React Hook Form + Zod + `@hookform/resolvers` (quando houver formulários).
7. **Novos componentes base:** adicionar via shadcn quando possível e documentar neste arquivo.

---

## 9. Onde estão os tokens

| Artefato       | Caminho                  |
| -------------- | ------------------------ |
| Tokens CSS     | `src/styles/globals.css` |
| Fonte          | `src/app/layout.tsx`     |
| Componentes UI | `src/components/ui/`     |
| Este documento | `docs/design-system.md`  |

---

## 10. Feedback e estados de UI

| Estado | Padrão |
| --- | --- |
| Loading | Skeletons de feature (`AdvertisementGridSkeleton`, `SellerProfileSkeleton`, etc.) |
| Erro | `ErrorMessage` + mensagem amigável |
| Vazio | `EmptyState` |
| Toast | Sonner (`toast.success` / `toast.error`) |

Não inventar indicadores paralelos fora desses padrões.

---

## 11. Próximos passos (fora do MVP / sugestões futuras)

- Sitemap.xml e imagens OG estáticas oficiais
- Componente Select do design system (substituir `<select>` nativo)
- Wiring de WhatsApp/compartilhar no detalhe do anúncio

Qualquer evolução visual deve atualizar **este documento** e os tokens em `globals.css` antes de espalhar mudanças nas telas.

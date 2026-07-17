# ClubePeças — Design System

Documento oficial de referência visual do Frontend.  
Todas as telas devem seguir estes padrões. Não inventar cores, tipografia ou componentes fora deste guia.

**Identidade:** *Industrial Premium* — SaaS + marketplace + automotivo.  
**Regra de cor:** ~90% neutro / ~10% destaque.

---

## 1. Princípios

| Princípio    | Significado                                              |
| ------------ | -------------------------------------------------------- |
| Confiança    | Blocos escuros de identidade + conteúdo claro organizado |
| Hierarquia   | Header / Hero / CTA / Footer em navy; cards claros       |
| Robustez     | Tipografia forte, preço em evidência, microinterações leves |
| Sofisticação | Sem glow, sem excesso de cor, sem layouts chamativos     |

---

## 2. Paleta oficial

Fonte da verdade: `src/styles/globals.css`.

| Token | Valor | Uso |
| --- | --- | --- |
| **Primary** | `#2563EB` | CTAs, preço, foco, acentos |
| **Brand** | `#0F2747` | Header, Hero, CTA, Footer |
| **Background** | `#F4F7FB` | Fundo da página |
| **Surface / Card** | `#FFFFFF` | Painéis e cards |
| **Border** | `#E5EAF2` | Contornos |
| **Text Primary** | `#14233B` | Títulos |
| **Text Secondary** | `#64748B` | Apoio (`muted-foreground`) |
| **Store (laranja)** | `#EA580C` | Ícone de loja |
| **Location (vermelho)** | `#E11D48` | MapPin |
| **WhatsApp** | `#25D366` | Ação WhatsApp |
| **Facebook** | `#1877F2` | Ação Facebook |
| **Share** | `#64748B` | Compartilhar |

### Superfície brand

Classe **`.surface-brand`**: fundo navy + textura técnica discreta + tipografia clara herdada.

---

## 3. Tipografia

Plus Jakarta Sans. Classes: `text-display`, `text-h1`–`text-h3`, `text-body`, `text-small`, `text-price`, `text-price-lg`.

Sobre `.surface-brand`, títulos ficam brancos e corpo usa `brand-muted`.

---

## 4. Espaçamento e elevação

- Seções da Home: `gap-20` → `gap-28` (desktop)
- Cards: `rounded-3xl` / `rounded-2xl`, `.card-interactive` (hover elevação + anel primary)
- Inputs: `h-10`, `rounded-xl`

---

## 5. Componentes

| Peça | Notas |
| --- | --- |
| Button | primary / secondary / outline / ghost / destructive / whatsapp / facebook |
| SearchInput | `tone`: default \| on-brand \| hero (campo amplo + botão Buscar) |
| Badge | Novo=success, Usado=secondary, Pausado=warning |
| Logo | `onBrand` adiciona fundo claro sobre navy |
| EmptyState | Borda tracejada + ícone |

---

## 6. Layouts

| Layout | Identidade |
| --- | --- |
| Header | `.surface-brand` |
| Footer | `.surface-brand` + canais |
| Auth | Faixa brand + card do formulário |
| Dashboard | Sidebar com topo brand; topbar clara |

---

## 7. Convenções

1. Cores apenas via tokens / classes do DS.
2. Sem estilos isolados fora do Design System.
3. Domínio em `features/`; `ui/` sem regra de negócio.
4. Não alterar hooks, services, mappers ou rotas por polish visual.

---

## 8. Artefatos

| Artefato | Caminho |
| --- | --- |
| Tokens | `src/styles/globals.css` |
| UI | `src/components/ui/` |
| Docs | `docs/design-system.md` |

# Docker local (Sprint 9.1)

A orquestração completa (API + Postgres + Nginx + este frontend) vive no repositório **ClubePecas**.

## Como subir

1. Clone/mantenha as pastas irmãs:

```text
Projetos/
├── ClubePecas/
└── CluebPecas.Portal/   ← este repo
```

2. No backend:

```bash
cd ../ClubePecas
cp .env.example .env
docker compose up -d --build
```

Documentação completa: `ClubePecas/docs/docker.md`.

## Dockerfile deste repositório

O arquivo `Dockerfile` na raiz do Portal é usado pelo Compose do backend (`FRONTEND_CONTEXT=../CluebPecas.Portal`).

Build multi-stage: `npm ci` → `next build` → `next start` (sem `output: 'standalone'` nesta sprint).

## Variáveis de build

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_API_URL` | Base da API no browser (via Nginx: `http://localhost`) |
| `NEXT_PUBLIC_SITE_URL` | URL canônica do site |

Após `docker compose up`, acesse http://localhost.

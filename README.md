# ClubePeças Portal

Frontend Next.js do marketplace ClubePeças.

## Desenvolvimento local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Configure `NEXT_PUBLIC_API_URL` apontando para a API (ex.: `http://localhost:5229`).

## Docker (stack completa)

O portal **não** sobe sozinho. Use o Compose do backend:

1. Repositórios irmãos: `ClubePecas/` e `CluebPecas.Portal/`
2. Em `ClubePecas`: `cp .env.example .env` e `docker compose up -d --build`
3. Acesse [http://localhost](http://localhost)

Documentação: [`docs/docker.md`](docs/docker.md) e [`ClubePecas/docs/docker.md`](../ClubePecas/docs/docker.md).

Build de produção no container: `output: "standalone"` (`next.config.ts`) + `Dockerfile` multi-stage.

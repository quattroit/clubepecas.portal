# Docker (frontend)

O portal **não** possui `docker-compose` próprio.

A orquestração completa (nginx + frontend + backend + postgres) fica em:

[`ClubePecas/docs/docker.md`](../../ClubePecas/docs/docker.md)

Build do frontend: `output: "standalone"` + `Dockerfile` multi-stage nesta pasta, consumido pelo Compose do backend via `FRONTEND_CONTEXT=../CluebPecas.Portal`.

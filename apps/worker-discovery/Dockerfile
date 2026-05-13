# Worker discovery — imagem leve (sem Playwright)
FROM node:20-slim AS base

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/worker-discovery/package.json ./apps/worker-discovery/
COPY packages/core/package.json         ./packages/core/
COPY packages/db/package.json           ./packages/db/
COPY packages/shared/package.json       ./packages/shared/
COPY packages/store-adapters/package.json ./packages/store-adapters/

RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/worker-discovery ./apps/worker-discovery
COPY packages              ./packages

RUN pnpm --filter @techgarimpeiro/core build && \
    pnpm --filter @techgarimpeiro/shared build && \
    pnpm --filter @techgarimpeiro/db build && \
    pnpm --filter @techgarimpeiro/store-adapters build && \
    pnpm --filter @techgarimpeiro/worker-discovery build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "apps/worker-discovery/dist/index.js"]

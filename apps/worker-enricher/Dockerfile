# Worker enricher — precisa de Playwright (Chromium)
FROM mcr.microsoft.com/playwright:v1.50.0-jammy AS base

WORKDIR /app

# Instala pnpm via corepack
RUN corepack enable

# Copia manifests para instalar dependências com cache
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/worker-enricher/package.json ./apps/worker-enricher/
COPY packages/core/package.json        ./packages/core/
COPY packages/curation/package.json    ./packages/curation/
COPY packages/db/package.json          ./packages/db/
COPY packages/messaging/package.json   ./packages/messaging/
COPY packages/shared/package.json      ./packages/shared/
COPY packages/store-adapters/package.json ./packages/store-adapters/

RUN pnpm install --frozen-lockfile

# Copia código-fonte
COPY tsconfig.base.json ./
COPY apps/worker-enricher  ./apps/worker-enricher
COPY packages              ./packages

# Build
RUN pnpm --filter @techgarimpeiro/core build && \
    pnpm --filter @techgarimpeiro/shared build && \
    pnpm --filter @techgarimpeiro/db build && \
    pnpm --filter @techgarimpeiro/curation build && \
    pnpm --filter @techgarimpeiro/messaging build && \
    pnpm --filter @techgarimpeiro/store-adapters build && \
    pnpm --filter @techgarimpeiro/worker-enricher build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "apps/worker-enricher/dist/index.js"]

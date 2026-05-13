FROM node:20-slim AS base

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/worker-publisher/package.json ./apps/worker-publisher/
COPY packages/core/package.json         ./packages/core/
COPY packages/db/package.json           ./packages/db/
COPY packages/messaging/package.json    ./packages/messaging/
COPY packages/shared/package.json       ./packages/shared/

RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/worker-publisher ./apps/worker-publisher
COPY packages              ./packages

RUN pnpm --filter @techgarimpeiro/core build && \
    pnpm --filter @techgarimpeiro/shared build && \
    pnpm --filter @techgarimpeiro/db build && \
    pnpm --filter @techgarimpeiro/messaging build && \
    pnpm --filter @techgarimpeiro/worker-publisher build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "apps/worker-publisher/dist/index.js"]

FROM node:20-slim AS base

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/bot-telegram/package.json ./apps/bot-telegram/
COPY packages/db/package.json       ./packages/db/
COPY packages/shared/package.json   ./packages/shared/
COPY packages/core/package.json     ./packages/core/

RUN pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/bot-telegram ./apps/bot-telegram
COPY packages          ./packages

RUN pnpm --filter @techgarimpeiro/core build && \
    pnpm --filter @techgarimpeiro/shared build && \
    pnpm --filter @techgarimpeiro/db build && \
    pnpm --filter @techgarimpeiro/bot-telegram build

ENV NODE_ENV=production
EXPOSE 8080

CMD ["node", "apps/bot-telegram/dist/index.js"]

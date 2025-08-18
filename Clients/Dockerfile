FROM node:20-slim

WORKDIR /app

RUN npm install -g pnpm@9 serve

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/*/package.json ./apps/
COPY packages/*/package.json ./packages/

RUN --mount=type=cache,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile --loglevel verbose

COPY . /app

RUN pnpm run build:customer-portal
RUN pnpm run build:manager-portal



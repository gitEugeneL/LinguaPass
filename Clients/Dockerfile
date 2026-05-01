FROM node:20-slim

WORKDIR /app

RUN corepack enable
RUN corepack prepare pnpm@9 --activate

RUN npm install -g serve

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build:customer-portal
RUN pnpm run build:manager-portal